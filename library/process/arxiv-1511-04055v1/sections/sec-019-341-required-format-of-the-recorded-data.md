---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-019-341-required-format-of-the-recorded-data
section_title: "Required format of the recorded data"
section_number: 3.4.1
pages: 7-8
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
Required format of the recorded data 
For the sake of complexity management and cognitive fit, it was decided to define a PPMChart as a visualization 
to display information of a single process modeling effort. Therefore, the tool requires as input an event log 
                                                          
9 The PPMChart Analysis plug-in for ProM 6 can be downloaded at http://www.janclaes.info/plugins.php. 
8 
 
 
containing data about a single PPM instance, grouped in traces per model element. Section 3.1 already explained 
which data of that PPM instance are needed. The required format of these data is described in this section. 
 
In order to visualize the PPM, a fixed list was selected of possible operations in the construction of a process 
model (see Table 1). In our analyses and modeling sessions we build on a subset of the BPMN notation that can 
be used for the modeling. This subset was selected to correspond with the supported notation of our modeling 
tool Cheetah Experimental Platform (CEP) (Pinggera, Zugal, & Weber, 2010) and consists of six of the ten most 
used elements of BPMN according to (Zur Muehlen & Recker, 2008): start and end event, activity, XOR and 
AND gateway, and edge. It can be considered as the set of common constructs that are available in most process 
modeling languages (e.g., BPMN, UML Activity diagrams, Petri nets, Workflow nets, YAWL). 
 
Besides creation of these model elements, the visualization also includes changes in the model. Activities, 
events and gateways can be moved over the canvas or deleted. Edges can be deleted or reconnected, an edge can 
be rerouted through creation, movement and deletion of edge bend points, and the label of an edge can be 
moved. Finally, activities and edges can be named or renamed. Note that for the remainder of the paper we 
assume only these modeling operations as part of the PPM (according to the recorded operations of the 
modeling tool), but our approach can easily be adapted for other modeling operation sets. 
Table 1. Operations in the construction of a process model. 
Create 
Move 
Delete 
CREATE_START_EVENT 
CREATE_END_EVENT 
CREATE_ACTIVITY 
CREATE_XOR 
CREATE_AND 
CREATE_EDGE 
MOVE_START_EVENT 
MOVE_END_EVENT 
MOVE_ACTIVITY 
MOVE_XOR 
MOVE_AND 
MOVE_EDGE_LABEL 
RECONNECT_EDGE 
DELETE_START_EVENT 
DELETE_END_EVENT 
DELETE_ACTIVITY 
DELETE_XOR 
DELETE_AND 
DELETE_EDGE 
 
Other :  NAME_ACTIVITY, RENAME_ACITIVTY, NAME_EDGE, RENAME_EDGE, 
 
CREATE_EDGE_BENDPOINT, MOVE_EDGE_BENDPOINT, DELETE_EDGE_BENDPOINT 
 
A plug-in for the well-known academic process mining framework ProM10 was developed to facilitate the 
creation of PPMCharts. The input for most plug-ins in this tool is an event log. The xes file format for event logs 
for ProM is xml based and follows a certain hierarchical structure: a process consists of traces and each trace is 
a collection of events11. The process, traces and events can have attributes. In order to be able to create a 
PPMChart, the events in the log have to store information about operations on model elements and the events 
that correspond with operations on the same model element have to be bundled in one trace. The plug-in expects 
the names of events to correspond with the operations in Table 1. Further, each event should have an attribute 
that stores the timestamp of the execution of the event and an attribute id that matches with the name of its trace. 
It can be seen as the unique identifier of the model element.
