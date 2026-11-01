---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-068-configuration
section_title: "Configuration"
section_number: null
pages: 29-30
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
Configuration 
At the left hand side, the view can be configured (see Fig. 5 in the paper).  
 
The Component type indicates which dimension is used to define the unit of the timelines. In contrast to the 
Dotted Chart Analysis plug-in, this option cannot be configured. The fixed value for this option in the 
PPMChart implementation is: 
 
Model element (default): select this option to view a timeline per model element. Each dot on the 
timeline represents an operation on the model element represented by the timeline (e.g., create, move, 
(re)name, delete of a particular XOR gateway). 
The Time option can be configured to zoom in on the timing of the operations. Next three options can be 
selected: 
 
Actual (default): select this option to view the dots positioned according to the real time of execution of 
the corresponding operation. 
 
Relative (Time): select this option to shift every time line in such a way that the first operation on each 
line is set to the beginning of the time interval of the PPMChart. 
 
Relative(Ratio): select this option to stretch every timeline in such a way that the first operation on 
each line is set to the beginning of the time interval and the last operation on each line is set to the end 
of the time interval (if at least two operations exist on the line). 
Vertical time intervals are marked according to the Time intervals configuration parameter. There are 13 
different options. 
 
L-1, L-10, L-100, L-500: select these options to divide the chart in time intervals of 1, 10, 100, or 500 
milliseconds respectively. Time intervals are indicated with white vertical lines starting at the time of 
the first operation in the chart. It is necessary to zoom in on the chart to be able to analyze the chart at 
millisecond level. 
 
Seconds, Minutes, Half hours, Hours (default): select these options to divide the chart in time intervals 
of seconds, minutes, half hours, or hours respectively. 
 
Days, Week, Months, Years: select these options to divide the chart in time intervals of days, weeks, 
months, or years respectively. It is necessary to zoom out on the chart to be able to analyze the chart at 
a level greater than one hour. 
The option Color by indicates if the dots have to be color-coded or not. The PPMChart in principle uses a fixed 
default color coding (if turned on), but the colors can be changed by the user in the Settings tab (see A.3. below). 
Next two options can be selected: 
 
None: select this option to remove color coding. Each dot will have the same color, which allows the 
user to focus on shape and position of the dots (in order to abstract from the type of operation). 
 
Operation (default): select this option to apply color coding. By default, create operations will be 
colored in green, move operations in blue, delete operations in red, and (re)naming in orange. A 
detailed legend of the default colors is displayed in Table 3 below. 
Use the Shape by setting to configure if the dots have to be shape-coded or not. The PPMChart in principle uses 
a fixed default shape coding (if turned on), but the shapes can be changed by the user in the Settings tab (see 
A.3. below). Next two options can be selected: 
 
None: select this option to turn off dot shaping. Each dot will be displayed as a circle, which allows the 
user to focus on color and position of dots (to abstract from the model element type of the operation). 
 
Model element (default): select this option to turn on dot shaping. Operations on activities will be 
displayed with rectangles, event operations with circles, gateway operations with diamonds, and edges 
with triangles. A detailed shape legend is displayed in Table 3 below. 
Sort by can be used to influence the order in which the timelines are sorted (vertically). If descending is 
selected, the sort order is reversed. Next eight options can be selected: 
 
None: select this option to select no ordering. The order of the data in the event log will be used. 
 
Model element: select this option to sort the lines by the model element identifier. The lines will be 
sorted according to the identifiers of the model elements represented by the timelines. 
 
Number of operations: select this option to sort the lines by the number of operations displayed on each 
line. Use this option to graphically observe differences between lines with fewer operations (top part of 
the chart if sorted according to this option) and lines with more operations (bottom part of the chart). 
 
Duration: select this option to sort the lines according to their duration. The duration is defined as the 
timespan between the first and the last operation on the line. This option allows to compare lines with 
shorter versus longer durations. 
30 
 
 
 
Distance from start (default): select this option to sort the lines according to the traversing order of the 
corresponding model elements from the start event towards the end event (see description in Section 
3.4.4 of the paper).  
 
Create order from start: select this option to sort the lines according to the logical order of creation of 
the corresponding elements from start event to end event (see description in Section 3.4.4 of the paper).  
 
First operation: select this option to sort the lines according to the time of the operation of the first dot 
on the line. This option facilitates to zoom in on the actual order of creation of model elements. 
 
Last operation: select this option to sort the lines according to the time of the operation represented by 
the last dot on the line. This option facilitates to zoom in on parts of the process model that are (not) 
touched towards the end of the modeling process. 
Configure the Mouse mode to set the way the mouse behaves in the plug-in. Next three options can be selected: 
 
Select (default): select this option to be able to select different dots. Click on a dot or make a 
rectangular selection to indicate of which dots to display information in a tooltip. 
 
Zoom in: select this option to be able to easily zoom in on parts of the PPMChart. Make a rectangular 
selection on the screen to indicate the area you want to zoom in on. 
 
Drag: select this option to be able to bring a different area of the chart into the displayed rectangle if 
zoomed in. Drag the chart under the displayed rectangle to show other parts of the chart. 
The sliders zoom (X) and zoom (Y) can be used to zoom in horizontal or vertical dimension respectively on a 
logarithmical scale. The Zoom out button restores the zoom level to 1 x 1. The Update button needs to be 
pressed after changing one or more of previous options before the PPMChart is repainted on the screen. 
Table 3. Default color (shade) and shape coding of events 
 
 
Create 
Move 
Delete 
(Re)name 
 
 
Green 
Blue 
Red 
Orange 
Start event 
 
 
Circle 
 
CREATE_START_EVENT 
Very light green circle 
MOVE_START_EVENT 
Very light blue circle 
DELETE_START_EVENT 
Very light red circle 
NAME_ACTIVITY 
RENAME_ACTIVITY 
Orange square 
End event 
 
 
Circle 
 
CREATE_END_EVENT 
Very light green circle 
MOVE_END_EVENT 
Very light blue circle 
 
DELETE_END_EVENT 
Very light red circle 
 
Activity 
 
 
Square 
 
CREATE_ACTIVITY 
Green square 
MOVE_ACTIVITY 
Blue square 
 
DELETE_ACTIVITY 
Red square 
 
XOR 
 
 
Diamon
d 
 
CREATE_XOR 
Dark green diamond 
MOVE_XOR 
Dark blue diamond 
 
DELETE_XOR 
Dark red diamond 
 
AND 
 
 
Diamon
d 
 
CREATE_AND 
Dark green diamond 
MOVE_AND 
Dark blue diamond 
 
DELETE_AND 
Dark red diamond 
 
Edge 
 
 
Triangle 
 
CREATE_EDGE 
Light green triangle 
MOVE_EDGE_LABEL 
Grey triangle 
DELETE_EDGE 
Light red triangle 
NAME_EDGE 
RENAME_EGE 
Orange triangle 
 
 
 
 
RECONNECT_EDGE 
Light purple triangle 
CREATE_EDGE_BENDPOINT 
MOVE_EDGE_BENDPOINT 
DELETE_EDGE_BENDPOINT 
Dark grey triangle 
RECONNECT_EDGE 
Light purple triangle
