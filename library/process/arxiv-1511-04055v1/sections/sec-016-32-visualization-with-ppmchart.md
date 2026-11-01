---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-016-32-visualization-with-ppmchart
section_title: "Visualization with PPMChart"
section_number: 3.2
pages: 5-6
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
Visualization with PPMChart 
The collected data about consecutive operations in a PPM instance are used to construct a PPMChart (see Fig. 
3). The horizontal axis represents a time interval of one hour by default. Vertically, each line represents one 
6 
 
 
element of the process model, as it was present during modeling. The model element identifier is displayed at 
the beginning of the line. Each colored dot on the line represents one operation performed on the element.  
 
The color of the dot corresponds with the type of operation: create (green), move (blue), delete (red) 
and (re)name (orange). 
 
The color shade and shape of the dot corresponds with the type of model element: activity (bright, box), 
event (very light, circle), gateway (dark, diamond) and edge (light, triangle). 
 
The position of the dot on the timeline corresponds with the time at which the operation was executed.  
The user can configure the order in which the timelines are presented. The default order of lines corresponds 
with the logical order from start event to end event of the elements in the process model (see Section 3.4.4). 
 
 
Fig. 3. Visualization of the events in the construction of one model by one modeler.7 (85) 
 
Fig. 4. Process model in BPMN notation as result of the modeling process in Fig. 3.8  
(Numbered circles indicate the model element id for comparison with highlight of Fig. 3) 
Fig. 3 shows the different operations in the creation of the process model represented in Fig. 4. The highlighted 
rectangle in Fig. 3 displays the first operations on the left part of the model in Fig. 4 (from start event to first 
XOR join gateway). On the first line, one can observe the creation of the start event (very light green circular 
dot). More to the right a very light blue circular dot represents a movement of that start event. The second line 
shows a light green triangle at the right that corresponds with the creation of the edge that connects the start 
event and the first activity. Within the highlighted rectangle, different other light green triangles can be 
discovered on different lines. These dots represent the creation of other edges in the process model. The third 
line contains a bright green square shaped dot. This is the creation of an activity. More to the right, a blue square 
shaped dot indicates that this activity is moved later on. If one focuses on all colored dots in the rectangular 
selection, one can conclude that the creation of start event, activities and split gateway in the highlighted section 
is followed by an almost simultaneous movement of these model elements (vertical pattern of blue dots). Only 
later (i.e., more at the right), the edges that connect these model elements were created (light green triangles).
