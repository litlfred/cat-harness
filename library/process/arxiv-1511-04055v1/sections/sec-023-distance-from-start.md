---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-023-distance-from-start
section_title: "Distance from start"
section_number: null
pages: 9-10
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
(see Fig. 6). This subsection explains both additional sort options, as well as the option to sort by ‘First 
operation’, which existed already in the Dotted Chart implementation and is used in two examples in this paper. 
 
(a) Distance from start 
(b) Create order from start 
Fig. 6. Additional sort order options in the PPMChart implementation. 
Distance from start 
The Distance from start sort option was added to sort the timelines according to the processing order of the 
corresponding model elements from start event to end event. This can be observed in Fig. 6a, which represents 
the left part of the process model of Fig. 4 and where the order of model elements is indicated with black circle 
annotations. For elements in parallel paths the order is rather arbitrary (see technical details below). 
To determine this order technically, we used the notion of length of an arc, path, path distance and shortest path. 
We define the length of an arc as the graphical distance between start and end point of the arc, regardless the 
actual routing of the arc through possible bend points. A path is a route between two elements in the process 
model and summarizes the consecutive model elements that are to be passed when traversing the model from A 
to B through nodes and directed arcs that connect these nodes. The distance of a path is the sum of the lengths of 
the arcs in the path. If an arc is the first or last element in the path, only half of its length is included in the 
distance. The shortest path between two nodes is the path that starts in one of the nodes and ends in the other 
node with the lowest distance. The distance from start orders each model element according to the distance from 
the shortest path from the start event to the model element. The distance from start for each model element in 
Fig. 6a is displayed right above or below the black circle annotation that indicates the order of the model 
elements. If two elements get the same distance value, the order of the related records in the log is preserved. 
Create order from start 
The Create order from start sort option was added under the assumption that in several modeling tools (e.g., 
ARIS, CEP) an edge connecting two nodes can only be created after the two nodes exist. Hence, it uses the same 
ordering mechanism as Distance from start, except that it puts each arc after the nodes it connects (see Fig. 6b). 
This sort option was added to resemble (our interpretation of) the logical order of creating the model elements in 
a process model from start event to end event (i.e., from left to right in the example). 
10 
 
 
Technically, while in the Distance from start ordering the value of the arc is the mean value of the nodes it 
connects, in the Create order from start ordering, it is the maximum value of the nodes it connects plus one.
