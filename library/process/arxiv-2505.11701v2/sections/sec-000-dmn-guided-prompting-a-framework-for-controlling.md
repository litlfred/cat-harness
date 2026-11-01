---
doc_id: arxiv-2505.11701v2
doc_title: "DMN-Guided Prompting: A Framework for Controlling LLM Behavior"
section_id: sec-000-dmn-guided-prompting-a-framework-for-controlling
section_title: "DMN-Guided Prompting: A Framework for Controlling LLM Behavior"
section_number: null
pages: 1-15
source_pdf: arxiv-2505-11701v1.pdf
source_sha256: e05cd1965defcdd4
toc_source: outline
---
LLM Behavior
Shaghayegh Abedi1 and Amin Jalali2
1 Politecnico di Torino, Turin, Italy,
s309894@studenti.polito.it
2 Stockholm University, Stockholm, Sweden,
aj@dsv.su.se
Abstract. Large Language Models (LLMs) have shown considerable potential
in automating decision logic within knowledge-intensive processes. However,
their effectiveness largely depends on the strategy and quality of prompting.
Since decision logic is typically embedded in prompts, it becomes challenging
for end users to modify or refine it. Decision Model and Notation (DMN) offers a
standardized graphical approach for defining decision logic in a structured, user-
friendly manner. This paper introduces a DMN-guided prompting framework that
breaks down complex decision logic into smaller, manageable components, guid-
ing LLMs through structured decision pathways. We implemented the framework
in a graduate-level course where students submitted assignments. The assign-
ments and DMN models representing feedback instructions served as inputs to
our framework. The instructor evaluated the generated feedback and labeled it
for performance assessment. Our approach demonstrated promising results, out-
performing chain-of-thought (CoT) prompting in our case study. Students also
responded positively to the generated feedback, reporting high levels of perceived
usefulness in a survey based on the Technology Acceptance Model.
Keywords: Large Language Models, Decision Model and Notation, Automated Feed-
back, Prompt Engineering
1
Introduction
Large Language Models (LLMs) have shown considerable potential in automating de-
cision logic within knowledge-intensive processes [12]. Their capabilities are increas-
ingly leveraged across multiple domains where complex decisions must be made. How-
ever, the effectiveness of LLMs critically depends on the quality of their instructions,
also known as prompts. Developing such prompts (commonly known as prompt en-
gineering) is often a trial-and-error process, requiring technical expertise and posing
challenges related to transparency, reusability, and maintenance [15, 19]. As decision
logics evolve, their instructional prompts must also be adapted - a task often non-trivial
for business users lacking technical proficiency in developing or adjusting prompts.
To address these challenges, we propose a novel framework that integrates Decision
Model and Notation (DMN) into prompt template definitions. DMN is a standardized
graphical notation for modeling decision logic [1,5]. By leveraging DMN to modular-
ize and guide prompt structures, our strategy enables LLMs to follow structured deci-
sion pathways, breaking down complex logic into interpretable and manageable com-
ponents. This approach reduces the dependency on ad hoc changes of prompts, making
arXiv:2505.11701v2  [cs.AI]  4 Sep 2025
2
Shaghayegh Abedi and Amin Jalali
it easier to understand, modify, and maintain - particularly in settings where clarity,
consistency, and collaboration are essential.
We implemented our proposed framework as a DMN-guided prompting framework
configured in a graduate-level course to automatically support generating feedback for
students’ assignments while having the instructor in the loop. Students submitted graph-
ical models representing domain-specific decisions. These models were transformed
into natural texts, which are given to our framework in addition to instructional DMN
rules defined by the course instructor. The framework generated feedback, which was
given to students after the instructor labeled them, so students could distinguish between
correct and incorrect feedback. These labeled data were used to evaluate the approach,
and the results show that DMN-guided prompting outperformed equivalent prompts de-
fined purely using chain-of-thought prompting [20]. In addition, students reported high
levels of perceived usefulness, as measured through a survey designed based on the
Technology Acceptance Model (TAM) [4].
The remainder of the paper is organized as follows. Section 2 provides a brief back-
ground on Decision Model and Notation (DMN) and prompt engineering, outlining
their relevance for guiding the behavior of Large Language Models. Section 3 intro-
duces the proposed DMN-guided prompting framework. Section 4 presents the case
study conducted in a graduate-level course, explaining the implementation process, re-
porting evaluation results, and discussing the strengths and limitations observed in the
study. Finally, Section 5 concludes the paper and introduces future directions.
2
Background
2.1
Decision Model and Notation
Decision Model and Notation (DMN) is a standard developed by the Object Manage-
ment Group (OMG) to represent decision logic in a clear, structured, and interpretable
format [1]. It is widely used in business process management to separate decision logic
from process flows, enabling organizations to formalize and automate operational deci-
sions transparently. A key advantage of DMN is its accessibility to both business pro-
fessionals and technical users. It offers graphical and tabular notations that help bridge
the gap between informal business rules and executable logic [2, 14]. DMN supports
decision modeling using the Decision Requirements Diagram (DRD) [1].
Fig. 1 presents a sample DRD that will serve as a running example throughout this
paper to illustrate our approach (for the complete DMN specification, refer to [1]). This
diagram specifies the rules for a fictitious loan eligibility process, where the decision
is based on the applicant’s Salary and Credit Score, modeled as input data elements.
A decision table element, named Loan Approval Rule, encodes the decision logic. The
decision output is then passed to a literal expression element, called Loan Approval
Result. Literal expressions represent decision logic using textual statements - in this
case, defining the message to be displayed to the user based on the decision outcome.
Loan Approval is an annotation that does not have any semantics yet enables providing
more information about elements in the DMN model.
Fig. 2 illustrates how the Loan Approval Rule decision table specifies the decision
logic. In DMN, a decision table can be used to document the rules governing a decision.
Each row in this table represents an individual rule, while columns define the conditions
DMN-Guided Prompting
3
Loan Approval Rule
Loan Approval Result
salary
creditScore
Loan Approval


Fig. 1. A decision requirements diagram example.
Hit policy:
Loan Approval Rule
Unique

> 50000
>= 700
approve
> 50000
[650..700[
manual_review
-
-
decline
1
2
3
Then
Is Eligible for Loan?
string

When
salary
string
And
creditScore
string

Fig. 2. A decision table example.
(inputs) and their corresponding outcomes (outputs). This tabular structure is intuitive
for many users, resembling familiar tools such as spreadsheets. In our example, the loan
will be approved if the applicant’s salary exceeds 50,000 and their credit score is greater
than or equal to 700. The rules in this example are evaluated top-down, and the dash
symbols in the final row represent a wildcard (“any input value”), which applies when
none of the above rules evaluate to true.
Fig. 3 shows how the literal expression is defined using the Friendly Enough Ex-
pression Language (FEEL). Based on the decision outcome, this expression determines
the message to be shown to the user.
It is important to note that we only present a simplified DMN example here to intro-
duce the essential concepts relevant to this paper. DMN supports a variety of modeling
styles, with detailed specifications provided in [1]. Overall, DMN offers a modular and
interpretable framework for defining decision logic. While it has traditionally been ap-
plied in operational and compliance domains, its potential for structuring interactions
between domain experts and AI-based systems such as Large Language Models (LLMs)
remains largely unexplored. This study investigates how DMN can guide LLMs in gen-
erating consistent and correct feedback.
4
Shaghayegh Abedi and Amin Jalali
Loan Approval Result
approave_message = "We're pleased to inform you that your loan application has been 
approved. Congratulations!".
manual_review_message = "We’d like to inform you that your application has been 
processed and requires a manual review. We will update you as soon as the review is 
complete.".
decline_message = "We regret to inform you that your loan application has not been 
approved due to either insufficient income or credit score. If you have any questions 
or would like further clarification, please feel free to contact us."
Fig. 3. A literal expression example.
2.2
Prompt Engineering
Prompt engineering refers to designing input instructions that effectively guide the be-
havior of Large Language Models. Because LLMs generate output based on probabilis-
tic patterns learned from large datasets, their responses are susceptible to the wording,
structure, and context provided in the prompt. As a result, prompt engineering is critical
in ensuring the relevance, accuracy, and clarity of the model’s output [13,17].
A variety of prompting strategies have emerged in recent research. These include
zero-shot prompting, where the model is asked to perform a task without examples;
few-shot prompting, which provides the model with a few example cases; and Chain-of-
Thought (CoT) prompting [20], which encourages the model to generate intermediate
reasoning steps before answering. Other techniques, such as retrieval-augmented and
role-based prompting, aim to inject external knowledge or frame the model’s behavior
through personas or task-specific instructions [6,16].
Among these strategies, Chain-of-thought prompting is reported to be effective for
complex tasks as it follows the divide-and-conquer approach, decomposing a task into
smaller sub-tasks and helping LLMs to follow a step-by-step approach to solve a prob-
lem. For example, instead of prompting the LLM to evaluate an assignment holisti-
cally, the task can be divided into sub-prompts that independently assess correctness,
clarity, and completeness. These individual judgments are combined to form the final
feedback [3]. Dividing prompts into individual parts is effective, yet some parts, like
business logics, change more frequently than others, requiring the prompt engineer to
refine the prompts. A framework enabling the separation of such business rules using
DMN can help business people to apply the changes directly, requiring less intervention
from a prompt engineer, and enabling organizations to apply changes more easily and
quickly.
3
DMN-Guided Prompting
We propose a structured prompting framework in which the behavior of Large Lan-
guage Models (LLMs) is guided by a formal specification based on the Decision Model
and Notation (DMN) standard.
Although DMN supports multiple representations of decision logic, our approach
adopts a divide-and-conquer strategy (including chain-of-thought prompting [20]) by
DMN-Guided Prompting
5
You are given two inputs:
1. A DMN file in XML format. It may contain one or more decision tables.  
2. A natural language description of a case.  
Your task is to extract the decision logic from the DMN and reason through the case using the
following steps.
A
### Phase 1: Extract Decision Logic from the DMN
...
B
+
### Phase 2: Process Each Entry Using Natural Language Input
...
C
+
### Output Format
return only the result list.
D
Fig. 4. The overall prompt structure used for DMN-guided evaluation.
organizing logic into modular units we refer to as triples. Each triple comprises (1)
a set of input data elements, (2) a decision table, and (3) a corresponding literal ex-
pression (as illustrated early in the paper in Fig. 1, including one sample triple). These
triples encapsulate logically self-contained decision-making units, each functioning as
an independent sub-prompt. This modular structure enables LLMs to process each unit
sequentially and coherently.
Fig. 4 outlines the full prompt template used to parse and evaluate the running ex-
ample DMN file, which can be adopted for different use cases differently. Prompt tem-
plates refinement is important as it gives organizations freedom in how to design DMN
models based on their needs. The process is divided into four sequential parts. While
the complete contents of Part B and Part C are not shown in the figure, the roles of each
part are as follows:
– Part A: Provides instructional and contextual data, including the DMN file and the
input text to be evaluated.
– Part B: Instructs the LLM to parse the DMN model.
– Part C: Guides the LLM in evaluating the input text based on the parsed DMN logic.
– Part D: Directs the LLM to return only the final decision output.
In the following sections, we elaborate on Part B and Part C.
3.1
Part B: Parsing the DMN Model
Part B instructs the LLM to parse the provided DMN content, as shown in Fig. 5. The
LLM is guided to extract each decision rule using explicit annotations. This approach
allows our framework to support multiple decision rules within a single DMN file. For
each rule, the LLM constructs a dictionary containing the following components: rule
name, list of input elements, decision table (name and contents), and literal expres-
sion (name and contents). This dictionary forms the knowledge base of triples used to
6
Shaghayegh Abedi and Amin Jalali
### Phase 1: Extract Decision Logic from the DMN
From the DMN file:
- Identify each decision rule (preferably using annotations as rule names).
- For each rule, extract a structured dictionary entry as follows:
```json
{
  "rule Name": {
    "input": [list of required input field names],
    "decision table": {
      "name": "<decision table name>",
      "content": "<decision table XML snippet>"
    },
    "literal expression": {
      "name": "<output name>",
      "content": "<list of outcomes and corresponding messages>"
    }
  }
}
B
Fig. 5. Instructions in Part B: parsing DMN into structured triples.
guide subsequent evaluations. Each triple corresponds to a logically encapsulated unit,
enabling the LLM to focus on discrete decision points within a larger decision model.
3.2
Part C: Evaluating the Input Text
Fig. 6 illustrates the instructions given in Part C, which guide the LLM in evaluating the
natural language input using the previously parsed decision logic. This phase comprises
four key steps applied to each entry in the extracted dictionary:
– C1 Extract Input Values: This step instructs the LLM to extract input values from
the extracted input list in the extracted dictionary. These input elements guide LLM
in extracting their value from the given text (see second instruction line in C1).
– C2 Evaluate Decision Table: Based on the extracted input values, the LLM eval-
uates the decision rule using the decision table. Examples are provided to illustrate
how to evaluate numeric intervals and enforce exact matching (following a few-shot
prompting strategy). These examples were found to be crucial in avoiding hallucina-
tions, particularly in boundary conditions.
– C3 Retrieve Literal Expression: Once a matching decision rule is identified, the
LLM retrieves the corresponding literal expression associated with the outcome.
– C4 Return Final Message: The final step ensures that only the decision message
(from the literal expression) is returned. The prompt instructs the LLM to avoid in-
cluding intermediate data structures such as the extracted dictionary. Without this
constraint, the LLM often included unnecessary reasoning traces, leading to down-
stream usage confusion.
3.3
Result Compilation and Final Output
After completing all sub-tasks, the LLM assembles the outputs into a single response
as described in Part D. Each triple is evaluated independently, and the results are syn-
DMN-Guided Prompting
7
### Phase 2: Process Each Entry Using Natural Language Input
For each extracted entry:
**Step 1: Extract Input Values**
- Identify the required input fields from the input list.
- From the natural language text, extract the values for those fields (even if not in key-
value format).
**Step 2: Evaluate the Decision Table**
- Evaluate input values strictly according to the decision table logic, any value shall be
treated accordingly (numbers below are examples):
    - [40..50] means inclusive of 40 and 50.
    - (40..50) means exclusive of both 40 and 50.
    - ]40..50[ means exclusive of both 40 and 50.
    - [40..50) means inclusive of 40, exclusive of 50 (and so on).
    - [40..50[ means inclusive of 40, exclusive of 50 (and so on).  
    - Do not round or approximate values. For instance, 39 must not match [40..50].
- Identify the name of the outcome for the matching rule.
**Step 3: Retrieve the Corresponding Literal Expression**
- Use the outcome name and look at the message instruction written in the `"literal
expression"` entry.
**Step 4: Generate the Replies**
- return the message exactly as written, without any change.
- generate a list named **result** include all generated messages, i.e., "result": [
C
C1
C2
C3
C4
Fig. 6. Instructions in Part C: evaluating input text using parsed DMN.
thesized into a coherent final output. The full implementation, including the Python
source code, the running example DMN file, and example input texts, is available on
our GitHub repository 3. It is important to emphasize that there is no need to modify the
prompt if decision rules are changed. Instead, users modify the DMN model, which the
LLM interprets to evaluate the logic and generate the results.
Furthermore, if customized message generation is desired, the LLM can post-process
the output messages using a secondary prompt. Otherwise, the framework returns only
the predefined messages specified in the DMN logic.
This framework offers several key benefits: Modularity: Components can be in-
dependently created, reused, or updated, supporting maintainable and scalable prompt
design. Interpretability: Each decision rule and its corresponding output are explicit
and traceable, enhancing transparency. Collaborative design: Domain experts can con-
tribute directly to changing decision logic and improving quality. Transparency: Most
significantly, it enables moving away from ad hoc prompt crafting toward systematic
and auditable LLM design for complex, rule-based tasks.
3 https://github.com/Shaghayegh-Abedi/DMN-prompting-project
8
Shaghayegh Abedi and Amin Jalali
4
Case Study
This case study investigates the feasibility and effectiveness of the proposed DMN-
guided prompting framework for automated feedback generation in an academic con-
text. Specifically, it examines how decision models can structure the behavior of large
language models (LLMs) to evaluate student-created process models and return pre-
defined feedback addressing common known problems in the models. We begin by de-
scribing the educational setting, followed by the implementation and evaluation method-
ology, and conclude with findings concerning system performance and student percep-
tions. Due to privacy concerns, the student submissions and responses could not be
published. However, the framework and example materials are provided in our GitHub
repository to help readers apply the framework to their own use cases.
4.1
Educational Setting and Study Context
The study was conducted in a graduate-level course titled Business Process Design and
Intelligence at the Department of Computer and Systems Sciences (DSV), Stockholm
University. A total of 24 student groups participated, each comprising approximately
six members. As part of their coursework, students were tasked with designing busi-
ness process models using Petri nets, implemented via the WoPeD tool [7] in an agile
way [8]. The models were expected to reflect best practices in Business Process Re-
design (BPR) [18], such as triage, parallelism, task elimination, automation, and re-
sequencing. Participation in the study was voluntary, and students provided informed
consent for using their anonymized submissions in this research.
4.2
Framework Deployment in the Case Study
Figure 7 depicts deploying the DMN-guided prompting framework within the course.
The setup comprises four primary actors: (i) the prompt engineer defining the prompt
template, (ii) the instructor, who encodes feedback logic using DMN triples; (iii) the
student, who submits process models for evaluation; and (iv) the DMN-guided prompt-
ing system, which generates feedback based on the encoded logic for each submission.
To ensure reliability, the generated feedback was not directly shared with students.
Instead, a human-in-the-loop mechanism was implemented: instructors manually re-
viewed each comment and classified it as correct or incorrect. The labeled feedback
LLM
defines
gets
Instructions
(DMN Model)
gets
Assignment
submits
receives
Feedback
generates
approves
Teacher
Student
  Prompt Template  
Writes
Prompt Engineer
Fig. 7. Application of the DMN-Guided Prompting Framework in our case study.
DMN-Guided Prompting
9
was subsequently communicated to students, reducing the risk of misleading them into
assuming that the received feedback was always correct. This approach safeguarded
the instructional quality and enabled an empirical evaluation of the system’s predictive
accuracy. The framework was executed for robustness using two LLMs - GPT-4o (via
the OpenAI API) and Gemini 1.5 Pro (via Google’s Gemini API). Additionally, we im-
plemented a Chain-of-Thought (CoT) [20] prompting set up as a performance baseline,
allowing us to isolate the impact of the DMN structure from general prompt engineering
strategies.
4.3
Technical Implementation
We developed a software component to operationalize the framework that translates
Petri net models into structured natural language descriptions. These descriptions retain
critical control flow and resource semantics, enabling LLMs to interpret process models
as standardized textual artifacts. The implementation is publicly available on GitHub for
reuse in similar applications. The core feedback mechanism comprises nine decision
rules, each encoded as a table in the Decision Model and Notation (DMN). These rules
align with specific BPR principles and provide pedagogically meaningful evaluation
criteria for student submissions.
4.4
Evaluation Results
Fig. 8 presents an overview of instructor-labeled feedback (for GPT-4o experiment)
across student groups and nine BPR rules. Each rule is assessed along two dimensions:
the student correctly applied the principle (Rule column), and the LLM-generated feed-
back (Feedback column). Table 1 provides a comparative analysis of four configura-
tions: DMN-guided and CoT prompting strategies, each paired with GPT-4o and Gem-
ini 1.5 Pro. Standard classification metrics - Precision, Recall, F1-score, and Accuracy
- were computed by comparing system outputs with instructor labels.
Group ID
Rule1
Feedback1
Rule2
Feedback2
Rule3
Feedback3
Rule4
Feedback4
Rule5
Feedback5
Rule6
Feedback6
Rule7
Feedback7
Rule8
Feedback8
Rule9
Feedback9
1 TRUE TRUE TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
FALSE FALSE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
2 TRUE TRUE TRUE
FALSE
TRUE
TRUE
TRUE
TRUE
FALSE FALSE FALSE FALSE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
3 TRUE TRUE TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
FALSE FALSE
TRUE
FALSE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
4 TRUE TRUE TRUE
FALSE
TRUE
TRUE
TRUE
TRUE
FALSE FALSE FALSE FALSE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
5 TRUE TRUE FALSE FALSE FALSE FALSE
TRUE
TRUE
FALSE FALSE
TRUE
FALSE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
6 TRUE TRUE FALSE FALSE
TRUE
TRUE
TRUE
TRUE
FALSE FALSE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
7 TRUE TRUE TRUE
TRUE
TRUE
TRUE
FALSE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
8 TRUE TRUE TRUE
TRUE
TRUE
TRUE
FALSE FALSE FALSE FALSE
TRUE
TRUE
FALSE
TRUE
TRUE
TRUE
FALSE
TRUE
9 TRUE TRUE TRUE
TRUE
TRUE
TRUE
TRUE
FALSE FALSE FALSE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
10 TRUE TRUE TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
FALSE FALSE
TRUE
FALSE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
11 TRUE TRUE TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
FALSE FALSE FALSE FALSE
TRUE
TRUE
TRUE
TRUE
TRUE
TRUE
12 TRUE TRUE FALSE FALSE
TRUE
FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE
TRUE
FALSE
TRUE
FALSE
13 TRUE TRUE TRUE
TRUE
TRUE
TRUE
FALSE FALSE FALSE FALSE FALSE FALSE FALSE
TRUE
FALSE FALSE FALSE FALSE
14 TRUE TRUE TRUE
TRUE
TRUE
TRUE
FALSE
TRUE
FALSE
TRUE
TRUE
TRUE
FALSE
TRUE
FALSE
TRUE
TRUE
TRUE
Fig. 8. Overview of instructor-labeled evaluations of GPT-4o–generated feedback, presented
across student groups and nine BPR rules. Each rule is assessed along two dimensions: whether
the student correctly applied the principle (Rule column) and the GPT-4o feedback (Feedback
column).
10
Shaghayegh Abedi and Amin Jalali
Approach
Model
Precision Recall F1-score Accuracy
DMN-guided
GPT-4o
0.91
0.90
0.91
0.87
Chain-of-Thought
GPT-4o
0.36
1.00
0.53
0.54
DMN-guided
Gemini 1.5 Pro
0.60
0.87
0.71
0.65
Chain-of-Thought Gemini 1.5 Pro
0.55
0.71
0.62
0.52
Table 1. Performance comparison of different prompting approaches.
The specified results in Table 1 show that the DMN-guided prompting generally
outperforms the CoT baseline across most metrics and models. The GPT-4o + DMN
configuration yielded the highest performance: 0.91 precision, 0.90 recall, 0.91 F1-
score, and 0.87 accuracy. In contrast, GPT-4o + CoT achieved perfect recall (1.00) but
suffered a severe drop in precision (0.36), resulting in a markedly lower F1-score of
0.53 - suggesting a high rate of false positives.
Gemini 1.5 Pro exhibited similar trends. The DMN-guided setup achieved an F1-
score of 0.71, outperforming the CoT variant (F1-score: 0.62). These results confirm
the value of integrating decision logic into prompt design for enhancing precision, con-
sistency, and pedagogical alignment in automated feedback systems.
4.5
Feedback Analysis and Rule-Specific Insights
To complement the quantitative findings, we conducted a detailed qualitative analysis to
assess the system’s capability to detect individual BPR principles and reveal underlying
student comprehension patterns. All 14 groups correctly applied Rule 1 (triage), and the
DMN-guided framework using GPT-4o flawlessly recognized these instances.
Rule 2 (task composition) was correctly implemented by the majority (79%) of the
groups, and the framework achieved 86% accuracy in identifying them - closely aligned
with the overall accuracy. Notably, in the two misclassified cases, students labeled the
merged task using unexpected phrasing (e.g., “check and register result” instead of the
expected formulation indicating the task is related to credit check), leading to reduced
model confidence in mapping the task semantics, as illustrated in Fig. 9.
For Rule 3 (knock-out), 93% of the groups modeled the principle correctly, and the
framework matched this performance with a 93% accuracy rate - exceeding its overall
average. This rule entails rejecting cases early based on credit score assessments (see
the XOR-split after “Check and Register Result” in Fig. 9).
Fig. 9. Example of a merged task with ambiguous labeling, leading to DMN-Guided framework
using GPT-4o feedback misclassification for Rule 2 (task composition).
DMN-Guided Prompting
11
In contrast, Rule 5 (task resequencing) was the most challenging for students, with
only one group (7%) correctly reordering tasks. Despite this, the framework success-
fully identified the intended logic in 93% of the cases. This rule involved moving
fraud detection earlier in the process and replacing manual evaluation with a machine
learning-based approach. The low implementation rate suggests students struggled with
abstract dependency reasoning, signaling a need for more advanced instructional scaf-
folding.
Rule 6 (deferred choice and contact reduction) was correctly applied by 64% of the
groups, with the framework achieving 79% accuracy. Some groups misused XOR-splits
to represent deferred choices. Some groups incorrectly modeled the deferred choice
pattern using an XOR-split, which is inappropriate in this context. The task required
groups to redesign the process to avoid repeatedly checking the status of an external
fraud detection request. According to the business-to-business agreement, the result
would be received automatically within two days; otherwise, a reminder should be sent.
Fig. 10 illustrates an example of a model that does not fully comply with the in-
tended design. The group correctly identified and modeled the deferred choice between
sending a reminder and receiving the result (though the automation aspect was not ex-
plicitly captured). However, they also added a separate “Wait for Result” task, introduc-
ing an unnecessary delay in the process. The DMN-guided framework using GPT-4o
successfully identified this issue, even though the merged task (“Receive Result”) was
not clearly labeled. This may be due to defining the task to be performed manually by
assigning it to the “Fraud Investigator,” which likely helped the LLM interpret the intent
from the surrounding context.
Regarding Rule 7 (parallelism between two automated tasks), 71% of the groups
applied it correctly, and the framework reached 79% accuracy. Some confusion arose
when students incorrectly applied task composition - merging two external web services
into a single task- violating design control assumptions, as the process designer cannot
merge such services.
Finally, for Rules 8 (parallelism of an automated and a manual task) and 9 (sequence
within parallelized tasks), 86% of the groups applied them correctly, and the framework
achieved an identical 86% accuracy - matching its overall performance.
Fig. 10. Example of an incorrectly modeled deferred choice, where an unnecessary ‘Wait for
Result’ task was added despite the presence of an automated reminder mechanism.
12
Shaghayegh Abedi and Amin Jalali
4.6
Perceived Usefulness
To assess the proposed system’s perceived usefulness (PU), we asked students to fill
out a survey designed based on the Technology Acceptance Model (TAM) [4], a com-
mon approach to measure perceived usefulness and ease of use of information systems
artifacts [9–11]. Fig. 11 shows the result in aggregated and detailed levels.
At the aggregated level, the overall PU construct, calculated as the average of the six
PU items, shows a high central tendency. The median value is above 5.5 on a 7-point
Likert scale, indicating strong agreement among participants regarding the system’s
usefulness. The narrow interquartile range suggests that most responses are concen-
trated around the upper scale values. While a few outliers exist (e.g., ratings around 3),
they do not significantly impact the overall distribution. This confirms that participants,
on average, perceived the system to be highly useful.
The detailed boxplots present the distribution of responses for each PU item (PU1 to
PU6). All six items reflect consistently high medians, typically at or above 5.5, reinforc-
ing the aggregated findings. Some variation in spread exists across items, particularly
for PU5, where responses show a slightly broader distribution. Nonetheless, even in
the presence of outliers, the central tendency for all items remains strong, indicating a
reliable pattern of positive user perception.
The consistency across items and low variability further support the internal reli-
ability of the PU construct and suggest that the users evaluated the system as useful
across different functional dimensions captured by the individual items.
Note on Perceived Ease of Use: Perceived Ease of Use (PEU) was not assessed, since
students interacted with the system only through the university’s Learning Management
System (LMS). In this context, PEU would reflect the usability of the LMS rather than
our system, making it irrelevant. In contrast, Perceived Usefulness (PU) was evaluated,
as students could reflect on the usefulness of the feedback received.
PU
0
1
2
3
4
5
6
7
aggregated level
PU1
PU2
PU3
PU4
PU5
PU6
0
1
2
3
4
5
6
7
detailed level
Fig. 11. Boxplots showing the distribution of Perceived Usefulness (PU) in aggregated and de-
tailed level.
DMN-Guided Prompting
13
Threats to Validity Our study has several limitations. Internal validity may be affected
by the manual labeling of feedback, which introduces subjectivity despite the human-
in-the-loop review. Construct validity is constrained by the chosen metrics (precision,
recall, F1, accuracy) and the survey-based perceived usefulness, which may not fully
capture long-term learning outcomes. External validity is limited since the case study
was conducted in a single graduate-level course with 24 groups and nine decision rules,
reducing generalizability to other domains and contexts. Finally, conclusion validity
may be influenced by the relatively small dataset and ceiling effects for some rules.
Further studies in diverse educational and professional settings are needed to strengthen
the generalizability of our findings.
5
Conclusion
This paper presented a novel prompting framework that integrates Decision Model
and Notation (DMN) with Large Language Models (LLMs) to guide decision logic
in a modular, interpretable, and user-friendly manner. By structuring prompts as DMN
triples (each consisting of input data, decision tables, and literal expressions), our ap-
proach operationalizes a divide-and-conquer strategy for LLM behavior control. The
case study conducted in a graduate-level course demonstrated that DMN-guided prompt-
ing generally outperformed chain-of-thought (CoT) methods in predictive accuracy.
Regarding user-perceived usefulness, students reported high perceived value from the
feedback generated by our DMN-based approach.
The results confirm the viability of DMN for LLM control in educational settings,
particularly for structured feedback generation. More broadly, this work illustrates the
untapped potential of DMN to encode domain-specific reasoning in a format that LLMs
can interpret and execute reliably, offering a promising direction for rule-based, trans-
parent AI systems.
Future research can expand in several directions. First, exploring how DMN-guided
prompting can be adapted for other application domains, such as healthcare or com-
pliance auditing, will help assess its generalizability. Second, combining DMN with
retrieval-augmented generation (RAG) may further enhance reasoning grounded in ex-
ternal knowledge. Third, if customized message generation is desired, the LLM can
post-process the output messages using a secondary prompt; otherwise, the framework
returns only the predefined messages specified in the DMN logic. Fourth, this approach
can be complemented by incorporating few-shot learning, where example inputs are
used to improve LLM accuracy when interpreting or applying DMN rules. Fifth, other
ways of defining DMN rules and alternative strategies for prompt construction can be
explored to increase flexibility and expressiveness. Finally, investigating multi-turn in-
teractions and conversational agents powered by DMN-guided LLMs could open new
opportunities for explainable and controllable AI interfaces in decision support sys-
tems.
Acknowledgment: The computations for testing and developing our approach were
enabled by resources provided by the National Academic Infrastructure for Supercom-
puting in Sweden (NAISS), partially funded by the Swedish Research Council through
grant agreement no. 2022-06725.
14
Shaghayegh Abedi and Amin Jalali
References
1. Decision Model and Notation Specification.
Technical Report 1.6, Object Management
Group - Standards Development Organization, 2024.
2. E. Bazhenova, F. Zerbato, B. Oliboni, and M. Weske. From BPMN process models to DMN
decision models. Information Systems, 83:69–88, 2019.
3. W. Cui, Z. Li, D. Lopez, K. Das, B. A. Malin, S. Kumar, and J. Zhang. Divide-Conquer-
Reasoning for Consistency Evaluation and Automatic Improvement of Large Language
Models. In Empirical Methods in Natural Language Processing, pages 334–361, 2024.
4. F. D. Davis. Perceived usefulness, perceived ease of use, and user acceptance of information
technology. MIS quarterly, pages 319–340, 1989.
5. M. De Leoni, P. Felli, and M. Montali. Integrating BPMN and DMN: modeling and analysis.
Journal on Data Semantics, 10(1):165–188, 2021.
6. G. Feng, B. Zhang, Y. Gu, H. Ye, D. He, and L. Wang. Towards Revealing the Mystery
behind Chain of Thought: A Theoretical Perspective. In Advances in Neural Information
Processing Systems, volume 36, pages 70757–70798. Curran Associates, Inc., 2023.
7. T. Freytag. Woped–workflow petri net designer. University of Cooperative Education, pages
279–282, 2005.
8. A. Jalali. Teaching business process development through experience-based learning and
agile principle. In Business Informatics Research, pages 250–265. Springer, 2018.
9. A. Jalali. Evaluating perceived usefulness and ease of use of cmmn and dcr. In business
process modeling, development and support, pages 147–162. Springer, 2021.
10. A. Jalali. Evaluating user acceptance of knowledge-intensive business process modeling
languages. Software and Systems Modeling, 22(6):1803–1826, 2023.
11. A. Jalali, F. M. Maggi, and H. A. Reijers. A hybrid approach for aspect-oriented business
process modeling. Journal of Software: Evolution and process, 30(8):e1931, 2018.
12. S. Khayatbashi, V. Sj¨olind, A. Gran˚aker, and A. Jalali. AI-enhanced business process au-
tomation: A case study in the insurance domain using object-centric process mining, 2025.
13. G. Marvin, N. Hellen, D. Jjingo, and J. Nakatumba-Nabende. Prompt Engineering in Large
Language Models. In I. J. Jacob, S. Piramuthu, and P. Falkowski-Gilski, editors, Data Intel-
ligence and Cognitive Informatics, pages 387–402, Singapore, 2024. Springer.
14. S. Mertens, F. Gailly, and G. Poels.
Enhancing Declarative Process Models with DMN
Decision Logic. In G. et al., editor, Enterprise, Business-Process and Information Systems
Modeling, pages 151–165, Cham, 2015. Springer.
15. M. Parker, C. Anderson, C. Stone, and Y. Oh. A Large Language Model Approach to Edu-
cational Survey Feedback Analysis. International Journal of Artificial Intelligence in Edu-
cation, 06 2024.
16. C. V. Rama Padmaja and S. Lakshminarayana.
Enhancing Language Models Through
Prompt Engineering - A Survey. In 2024 IEEE International Conference on Intelligent Sys-
tems, Smart and Green Technologies (ICISSGT), pages 117–121, 2024.
17. S. Ramanathan, L.-A. Lim, N. R. Mottaghi, and S. Buckingham Shum. When the Prompt
becomes the Codebook: Grounded Prompt Engineering (GROPROE) and its application to
Belonging Analytics. In LAK ’25, page 713–725, New York, NY, USA, 2025. ACM.
18. H. A. Reijers and S. L. Mansar. Best practices in business process redesign: an overview and
qualitative evaluation of successful redesign heuristics. Omega, 33(4):283–306, 2005.
19. K. Sandkuhl. LLM-Assistance for Quality Control of LLM Output. In V. ˇRepa, R. Mat-
uleviˇcius, and E. Laurenzi, editors, Business Informatics Research, Cham, 2024. Springer.
20. J. Wei, X. Wang, D. Schuurmans, M. Bosma, B. Ichter, F. Xia, E. H. Chi, Q. V. Le, and
D. Zhou. Chain-of-thought prompting elicits reasoning in large language models. In Neural
Information Processing Systems, Red Hook, NY, USA, 2022. Curran Associates Inc.
DMN-Guided Prompting
15
A
Appendix
This section provides a list of questions asked in the survey to measure perceived use-
fulness, following the Technology Acceptance Model (TAM). Participants rated their
agreement with the following statements on a 7-point Likert scale (1 = Strongly Dis-
agree, 7 = Strongly Agree):
1. Using the auto-feedback system enabled me to identify relevant BPR patterns more
quickly.
2. Using the auto-feedback system improved my performance in applying BPR pat-
terns to business process redesign.
3. Using the auto-feedback system increased my productivity when analyzing and
revising business process solutions.
4. Using the auto-feedback system enhanced my effectiveness in recognizing missing
BPR patterns.
5. Using the auto-feedback system made it easier for me to understand which BPR
patterns were applicable.
6. I found the auto-feedback system useful for learning and applying BPR patterns in
business process redesign tasks.
