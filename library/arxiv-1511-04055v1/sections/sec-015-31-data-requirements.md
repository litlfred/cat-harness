---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-015-31-data-requirements
section_title: "Data requirements"
section_number: 3.1
pages: 5-5
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
Data requirements 
The PPM is a human endeavor in which a modeler constructs a process model by drawing model elements such 
as activities, events, gateways, and edges on a canvas (see Fig. 2). In order to be able to represent a PPM 
instance with the PPMChart visualization, data of the PPM instance need to be collected at a specific level (see 
Section 3.4.1). Therefore, it is convenient if a modeling tool with logging functionality is used for the 
construction of the process model. The PPMChart implementation is created under the assumption that it is 
possible to record data on every modeling operation on the canvas (e.g., create start event, create activity, move 
activity). Besides the name of each operation, the visualization needs two more attributes: the identifier of the 
model element on which the operation was performed and the timestamp of the execution of the operation. 
Possible other recorded attributes (such as the position of a model element on the canvas) are ignored by the 
visualization. 
 
 
Fig. 2. The process of process modeling and the attributes of the captured data.
