---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-026-345-filter-options
section_title: "Filter options"
section_number: 3.4.5
pages: 10-10
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
Filter options 
In order to raise cognitive fit and for complexity management, the PPMChart can be filtered from within the 
plug-in to show or hide dots on the charts. Model element types can be selected to hide all operations on all 
model elements of that type (e.g., hide operations on edges). The timelines representing these model elements 
remain in the chart in order to preserve the positioning of the remaining timelines, but the concerned dots on 
these timelines are hidden. Next, it is also possible to hide specific operations by selecting the operation type in 
the filter panel (e.g., hide (re)name operations). Every dot that represents an operation of the selected type will 
be hidden. Finally, if the checkbox at the bottom is selected, all operations of model elements for which an 
operation exist of the selected type are hidden (e.g., hide deleted elements). Every dot on the timelines that 
contain at least one dot representing an operation of the selected type is removed from the chart. 
3.4.6 
Example 
Fig. 5 above shows an example of the implementation. The lines are vertically sorted by ‘First operation’. On 
the first line a circle indicates that a start or end event was created first. The last line represents the last created 
model element. It appears to be an edge (triangle). At one moment in time a lot of elements were moved 
simultaneously (perfectly vertical blue line formed by blue dots of different shapes), and somewhat later it can 
be observed that a lot of elements were deleted right after each other (almost vertical red line). The deleted 
elements were mainly events and edges (circles and triangles). Immediately after these operations, a high 
number of edges were created or reconnected (light green and gray rectangles below the red vertical line).
