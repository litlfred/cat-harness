/**
 * **The deployment resolver**: for each task of a process, who may run it in
 * a deployment, and with which Tool.
 *
 * Bean `folio-assistant-v3zw`, under `o1by`. The design is
 * `docs/proposals/deployment-descriptions.md` §3.2.
 *
 * ## It reports, and never fails
 *
 * Owner, 2026-10-24, §5 question 3, option C: "a task no placement can run"
 * appears in the report and never blocks a merge. So this module returns a
 * report and has no gate. A caller that turns a finding into an exit code is
 * going against that ruling.
 *
 * ## A pure function over what the caller reads
 *
 * It takes the description, the actors, the tasks and the Tools as values and
 * reads no files. Reading the process and Tool graphs is the job of the layer
 * that implements commands (cat-harness-tools); the rule for matching them is
 * here, where it can be tested without a corpus.
 *
 * ## What it can decide, and what it says it cannot
 *
 * | Tool requirement | decided from |
 * |---|---|
 * | `requires.network: true` | the placement's reach, through `effectiveReach`. Unknown reach does NOT satisfy it: an unknown is routed like air-gapped (`actor-reach.ts`). |
 * | `requires.os`, `requires.runtime` | nothing yet. A placement does not declare an OS or a runtime, so these are reported as **could not determine**, never as satisfied. |
 *
 * A Tool with no `requires` works for every placement.
 *
 * @graphNode schema
 * @module folio-assistant/schemas/deployment-resolver
 */

import { canReachOut, type EffectiveReach } from "./actor-reach.js";
import { placementReach, type DeploymentDescription, type Placement } from "./deployment-description.js";
import type { ActorKind } from "./skill-package.js";

/** The actor facts the resolver reads. `roles` empty or absent is unconstrained. */
export interface ResolverActor {
  id: string;
  kind: ActorKind;
  roles?: readonly string[];
  reach?: DeploymentDescription["topology"]["network"];
}

/** One task of a process, as a caller reads it from the BPMN. */
export interface ResolverTask {
  process: string;
  task: string;
  /** The lane's role id. Absent means the lane names no role. */
  role?: string;
  /** Kinds that may fulfil it (`fulfilmentKindsForBpmnType`). Absent is unconstrained. */
  kinds?: readonly ActorKind[];
  /** Skills the task needs. Empty or absent: no Tool is needed. */
  skills?: readonly string[];
}

/** The Tool facts the resolver reads. */
export interface ResolverTool {
  id: string;
  satisfies: readonly string[];
  requires?: { os?: readonly string[]; runtime?: readonly string[]; network?: boolean };
}

/** Whether one Tool works for one placement. */
export type ToolFit = "works" | "needs-network" | "could-not-determine";

export interface ToolVerdict {
  tool: string;
  fit: ToolFit;
  /** Why, when it is not `works`. */
  reason?: string;
}

export interface PlacementVerdict {
  /** Index into the description's `placements`, since one actor may be placed twice. */
  placement: number;
  actor: string;
  host?: Placement["host"];
  reach: EffectiveReach;
  /** One entry per skill the task needs, with each Tool satisfying it. */
  skills: { skill: string; tools: ToolVerdict[] }[];
  /** Every needed skill has a Tool that works here. */
  runnable: boolean;
}

export interface TaskVerdict {
  process: string;
  task: string;
  role?: string;
  /** Placements whose actor may take the lane's role and is of an allowed kind. */
  candidates: PlacementVerdict[];
  /** No candidate can run it: no one may take the role, or no Tool works for any who may. */
  unrunnable: boolean;
}

export interface DeploymentReport {
  deployment: string;
  tasks: TaskVerdict[];
  /** The report's own headline: tasks no placement can run. Reported, never a failure. */
  unrunnable: { process: string; task: string; why: string }[];
}

/**
 * Whether an actor may take a role. A role the actor lists, or one it inherits
 * through `isA` (the role graph's IS-A closure, which the caller supplies). An
 * actor with no roles listed is unconstrained, as `ActorDef.roles` says.
 */
function mayTake(
  actor: ResolverActor,
  role: string | undefined,
  isA: (actorRole: string, laneRole: string) => boolean,
): boolean {
  if (role === undefined) return true;
  if (!actor.roles || actor.roles.length === 0) return true;
  return actor.roles.some((r) => r === role || isA(r, role));
}

function toolFit(tool: ResolverTool, reach: EffectiveReach): ToolVerdict {
  const req = tool.requires;
  if (req?.network === true && !canReachOut(reach)) {
    return {
      tool: tool.id,
      fit: "needs-network",
      reason: `needs the network; this placement's reach is ${reach}`,
    };
  }
  if ((req?.os?.length ?? 0) > 0 || (req?.runtime?.length ?? 0) > 0) {
    return {
      tool: tool.id,
      fit: "could-not-determine",
      reason: "requires an OS or runtime, and a placement does not declare either",
    };
  }
  return { tool: tool.id, fit: "works" };
}

/**
 * The report for one deployment. Never throws for a task nobody can run; that
 * is the finding it exists to report.
 */
export function resolveDeployment(
  deployment: DeploymentDescription,
  actors: readonly ResolverActor[],
  tasks: readonly ResolverTask[],
  tools: readonly ResolverTool[],
  isA: (actorRole: string, laneRole: string) => boolean = () => false,
): DeploymentReport {
  const actorById = new Map(actors.map((a) => [a.id, a]));
  const toolsFor = (skill: string) => tools.filter((t) => t.satisfies.includes(skill));

  const verdicts: TaskVerdict[] = tasks.map((task) => {
    const candidates: PlacementVerdict[] = [];
    deployment.placements.forEach((p, i) => {
      const actor = actorById.get(p.actor);
      if (actor === undefined) return; // deploymentProblems reports it
      if (task.kinds && !task.kinds.includes(actor.kind)) return;
      if (!mayTake(actor, task.role, isA)) return;
      const reach = placementReach(deployment, p, actor);
      const skills = (task.skills ?? []).map((skill) => ({
        skill,
        tools: toolsFor(skill).map((t) => toolFit(t, reach)),
      }));
      candidates.push({
        placement: i,
        actor: p.actor,
        host: p.host,
        reach,
        skills,
        runnable: skills.every((s) => s.tools.some((t) => t.fit === "works")),
      });
    });
    return {
      process: task.process,
      task: task.task,
      role: task.role,
      candidates,
      unrunnable: !candidates.some((c) => c.runnable),
    };
  });

  const unrunnable = verdicts
    .filter((v) => v.unrunnable)
    .map((v) => ({
      process: v.process,
      task: v.task,
      why:
        v.candidates.length === 0
          ? `no placement may take the role ${v.role ?? "(none)"}`
          : `no Tool works for any placement that may take it: ${v.candidates
              .flatMap((c) => c.skills.filter((s) => !s.tools.some((t) => t.fit === "works")).map((s) => `${c.actor}: ${s.skill}`))
              .join("; ")}`,
    }));

  return { deployment: deployment.id, tasks: verdicts, unrunnable };
}
