---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-002-2-motivation
section_title: "Motivation"
section_number: 2
pages: 2-3
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
The goal of the research presented in this paper is to develop a visualization that can assist the study of the 
process of process modeling (PPM) in a cognitive effective fashion. Cognitive effectiveness is defined as the 
speed, ease and accuracy with which a representation can be processed by the human mind (Larkin & Simon, 
1987). The inspiration for the PPMChart visualization was drawn from the Dotted Chart (Song & Van der Aalst, 
2007). It was perceived to have an optimal balance between representing information about the structure of the 
overall process and the timing and relation of individual events. First, the Dotted Chart is presented in Section 
2.1. Next, Section 2.2 evaluates the Dotted Chart as a solution for graphical analysis of the PPM. It can be 
concluded that the Dotted Chart in its current implementation is inadequate for studying the PPM in a cognitive 
effective way and that an adapted visualization is needed. 
2.1 
Dotted Chart 
The Dotted Chart visualization displays the events of the instances of a process as colored dots on timelines. 
Each timeline corresponds with one particular execution instance of the analyzed process and each colored dot 
on the timeline corresponds with a specific event for that process instance. The color of the dot indicates which 
event happened, while the position of the dot on the timeline represents the time when the event occurred (see 
Fig. 1a). It can be observed from Fig. 1a that it is difficult to analyze a Dotted Chart that contains information of 
all recorded PPM instances. For example, it is not possible to know which dots represent different events on the 
same model element (e.g., creation, movement, renaming of a particular activity) without manually 
                                                          
3 The only implementation of the Dotted Chart we are aware of, is the Dotted Chart Analysis plug-in in the process mining framework ProM 
3 
 
 
investigating attributes in the event log (i.e., without leaving the plug-in). Therefore, one could focus on a single 
PPM instance if the event log is split into multiple event logs (one for each instance). The events in these event 
logs can then be grouped per model element (rather than per PPM instance). In this case, a Dotted Chart taking 
one such event log as input represents the operations of only one PPM instance (see e.g. Fig. 1b). We conclude, 
that it is possible to use the Dotted Chart for the visual study of the PPM. In the next section, we discuss the
