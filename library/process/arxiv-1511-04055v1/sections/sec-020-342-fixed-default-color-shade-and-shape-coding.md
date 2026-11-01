---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-020-342-fixed-default-color-shade-and-shape-coding
section_title: "Fixed default color, shade and shape coding"
section_number: 3.4.2
pages: 8-9
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
Fixed default color, shade and shape coding 
Visual expressiveness is increased by the addition of default shade and shape coding. In order to preserve 
semantic transparency, size, texture and orientation are currently not used as symbol discriminating factors. The 
selection of similar colors and shapes for similar operations improves perceptual discriminability. This 
introduces some redundant coding (i.e., the type of model element can be deduced from the color shade and 
from the shape) (Green & Swets, 1966), but increases perceptual pop-out (because almost each different 
operation has its unique color (shade), it is easy for the human brain to filter out specific operations/colors) 
(Quinlan, 2003; Treisman & Gelade, 1980).  
 
The introduction of shades of colors reduces the amount of necessary colors, which adheres to the principle of 
graphic economy. The amount of used graphical variables raises (i.e., increased visual expressiveness), while 
the amount of values for each graphical variable can be limited to a lower number (i.e., graphic economy). 
Because the goal of the PPMChart is to reduce cognitive load and increase cognitive effectiveness for the study 
of data on the PPM, much importance was attached to this principle. The graphic economy of a representation 
with more than six different colors can be increased by (i) increasing visual expressiveness, (ii) reducing 
semantic complexity, and (iii) introducing symbol deficit (Moody, 2009). As a consequence, symbol deficit was 
introduced on operations on both types of events (i.e., start and end event) and both types of gateways (i.e., 
AND and XOR gateway). Perceptual discriminability advocates the choice for exactly these symbols to 
introduce symbol deficit, because they are most similar. However, the user can still change the color (shade) and 
shape of the dots such that both gateways and both events can be graphically distinguished. 
                                                          
10 The ProM tool can be downloaded at http://www.promtools.org. 
11 The xes file format of ProM is described at http://www.xes-standard.org. 
9 
 
 
 
Furthermore, semantic transparency is increased by selecting logical colors. Shades of green represent create 
operations and shades of red represent delete operations. For move operations, the third primary color was 
selected (i.e., blue). The selected shapes are similar to the BPMN symbol for the element type (square for 
activities, circle for events, diamond for gateways). Lastly, cognitive integration is facilitated by selecting fixed  
default coding. This resulted in the fixed default color (shade) and shape coding as presented in Table 2. 
However, the user can still modify the color (shades) and shapes in the Settings tab. 
Table 2. Default colors, shades and shapes of the PPMChart Analysis plug-in. 
Operation 
Color 
 
Model element 
Shape 
Color shade 
Create 
Green 
 
Activity 
Rectangle 
Bright 
Move 
Blue 
 
Event 
Circle 
Very light 
Delete 
Red 
 
Gateway 
Diamond 
Dark 
(Re)name 
Orange 
 
Edge 
Triangle 
Light
