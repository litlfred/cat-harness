---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-000-1-introduction
section_title: "Introduction"
section_number: 1
pages: 1-2
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
In the quest for knowledge about how to make process models of high quality, recent research focus is shifting 
from studying the quality of process models to studying the process of process modeling itself (PPM). The PPM 
is a phase in the process model development lifecycle where the mental view of the modeler on the process is 
formalized into a graphical process representation (Hoppenbrouwers, Proper, & Van der Weide, 2005) (see e.g. 
Fig. 2). It encompasses the course of action taken by the modeler to design/construct a (business) process model 
consisting of start and end event(s), activities, gateways, edges, etc. Such a process model artifact is created by a 
stepwise design process; e.g., first putting a start event on the canvas, then an activity, then an arc connecting 
the start event and the activity, etc. The aim of PPM research is mainly to determine the characteristics of the 
process of process modeling that have a positive impact on process model quality. It is not about what is a good 
process model, but how can a good process model be created. 
 
In order to be able to study current (implicit) modeling approaches of various modelers, since 2010 various 
datasets with data about such construction activities were collected in a series of observational modeling 
sessions executed at different universities in Europe (Pinggera, Furtner, et al., 2013; Weber, Pinggera, Zugal, & 
Wild, 2010; Weidlich et al., 2010)2. These data are being used in order to examine the PPM, mainly from a 
control flow perspective. The goal of the study presented in this paper is to discover characteristics of various 
model constructions (i.e., instances of the PPM). Ultimately, these exemplar cases can be used to examine if 
more generic modeling patterns exist (e.g., Pinggera, Soffer, et al., 2013). The patterns can then be studied 
further to evaluate if certain modeling patterns impact process model quality in a positive way: i.e., the search 
for best practices that can be generalized in empirically validated process modeling guidelines and tool support 
(e.g., Claes et al., 2012). 
 
This paper describes the design of a tool to recognize and analyze these patterns in a cognitive effective way. 
The cognitive fit theory (CFT) states that a certain cognitive task can be optimally performed if the task material 
is represented appropriately (Vessey & Galletta, 1991). According to this theory, the proper instrument to 
discover relationships in datasets, are diagrams (Larkin & Simon, 1987). In other words, a visual representation 
of the data is believed to be a means to improve the efficacy of the cognitive task to discover patterns in the data 
                                                          
1 The final publication is available at Springer via http://dx.doi.org/10.1007/s10257-014-0245-4 
2 An overview of these modeling sessions can be consulted at http://bpm.q-e.at/experiments. 
2 
 
 
(Fekete, Van Wijk, Stasko, & North, 2008). Furthermore, humans excel in visual pattern recognition (Baird, 
Coates, & Fateman, 2003). Therefore, a visualization was designed to support researchers, practitioners and tool 
developers to get insights in the PPM to develop theory, training and tools for improving process model quality. 
 
For the visualization described in this paper, inspiration was drawn from the process mining research field (Van 
der Aalst, 2011). Process mining techniques make use of historical data of various process executions (i.e., 
process instances) to graphically represent and analyze a particular process (Weijters & Van der Aalst, 2001). 
The PPM is a typical type of process that also can be analyzed with process mining techniques. More specific,
