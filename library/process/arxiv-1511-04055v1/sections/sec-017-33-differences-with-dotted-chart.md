---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-017-33-differences-with-dotted-chart
section_title: "Differences with Dotted Chart"
section_number: 3.3
pages: 6-7
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
Differences with Dotted Chart 
The PPMChart visualization differs from the classical Dotted Chart mainly in four ways: 
                                                          
7 High resolution graphs in color of all figures in this paper are available from http://www.janclaes.info/papers/PPMISeB. 
8 Download an animation showing how the PPMChart evolves during the model construction at http://www.janclaes.info/papers/PPMISeB. 
7 
 
 
(i) 
In contrast to the typical use of a Dotted Chart, the PPMChart displays information about only one 
process instance. Each timeline represents a particular model element of the constructed process 
model (i.e., activity, gateway, edge, etc.). The events in the PPM, represented by the colored dots, 
are the operations (i.e., creation, movement, deletion, etc.) performed on the particular model 
element represented by the timeline. See Section 3.4.1. 
(ii) 
The PPM has a fixed set of possible operations and therefore, in a PPMChart, these operations are 
mapped on fixed default colors, color shades and shapes, which eases the visual comparison of 
different charts. For the same reason, every PPMChart shows initially information of the same 
timespan (i.e., one hour). Nevertheless, the option to change the color (shade) and shape coding of 
the dots and to zoom in or zoom out to influence the displayed timespan still exists. See Sections 
3.4.2 and 3.4.3. 
(iii) 
For different graphical pattern analyses, the Dotted Chart can be sorted according to several sort 
options. Two sort options are added in the PPMChart implementation, which facilitate the study of 
the PPM with the charts. See Section 3.4.4. 
(iv) 
The option to filter certain operations (individual dots) or model elements (individual timelines) 
enables the analyst to take different views at different abstraction levels on the data from within the 
PPMChart implementation. For example, one can focus on creation of model elements if other 
operation types are filtered out. See Section 3.4.5.
