---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-062-72-process-models
section_title: "Process models"
section_number: 7.2
pages: 22-23
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
Process models 
A conceptual (process) model is a “formal description of some aspects of the physical and social world around 
us for purposes of understanding and communication” (Mylopoulos, 1992, p. 3). A combination of textual and 
graphical notations can be used for this formal specification (Engelen & Van den Brand, 2010). When the focus 
is on control flow (i.e., the order of activities and events), graphical representations are preferred over textual 
models (Weske, 2007). Various graphical process model notations exist (e.g., BPMN (OMG, 2011a), UML 
Activity diagrams (OMG, 2011b), Petri nets (Reisig & Rozenberg, 1998), Workflow nets (Van der Aalst, 1998), 
YAWL (Van der Aalst & Ter Hofstede, 2005), and Event-Driven Process Chains (Scheer, 1998)). To capture 
the complexity of processes, process models make use of the principles of structuring and abstraction 
(Polyvyanyy, 2012). For example, many process models do not show information at instance level, but 
summarize information of different executions, while often hiding infrequent behavior (Polyvyanyy, Smirnov, 
& Weske, 2010; Reichert, 2013).  
 
In terms of process model visualization, it should be noted that recent research studies how changes in the 
process model notation can help to lower the mental effort for the reader to interpret the models. For example, in 
order to bridge the gap between the traditional formal process model notations used by process modelers and the 
informal representations often used in practice (Barros & Ter Hofstede, 1998; Phalp, 1998), icons are introduced 
in existing model notations (Mendling, Recker, & Reijers, 2010). Other research focuses on the addition of a 
third dimension to the model (Effinger, 2013) or represents the process model in a virtual world (Brown, 2010; 
Guo, Brown, & Rasmussen, 2013). Also, more creative approaches are used, such as sonification (Hildebrandt, 
Kriglstein, & Rinderle-Ma, 2012). 
 
23 
 
 
Although the different abstraction mechanisms and visual optimizations of the notations have success in 
supporting readers of the models to deal with the complexity of the represented process, they have in common 
that they hide details of individual instances. Therefore, classical process model notations are not suitable for the 
in-depth analysis at instance level of processes in general and the PPM in particular. In contrast, the PPMChart 
visualization represents only one PPM instance of which no details are hidden. This only shifts the complexity 
problem, because one still needs to compare a high number of charts for obtaining an overview over different 
instances, but this better fits with the goal of the exploratory research of this paper, which aims at revealing in-
depth information. Therefore, traditional process model notations are not appropriate to support this research.
