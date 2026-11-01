---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-063-73-visualizations-that-concentrate-on-control-fl
section_title: "Visualizations that concentrate on control flow and hierarchy"
section_number: 7.3
pages: 23-24
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
Visualizations that concentrate on control flow and hierarchy 
An optimal visualization technique for exploratory research about the characteristics of the PPM should show a 
lot of details about the recorded operations on model elements, focusing on timing and relative order and taking 
the hierarchical structure of the data into account. Therefore, this subsection presents a number of visualizations 
that concentrate on control flow or hierarchy and discusses their potential usefulness as an instrument to 
graphically detect characteristics of the PPM from the collected observational data. 
 
Different visualizations exist to represent hierarchical information (e.g., Treemaps (Johnson & Shneiderman, 
1991), Timeline Trees (Burch, Beck, & Diehl, 2008), Arctrees (Neumann, 2005), Information Slices (Andrews, 
1998), Sunburst diagrams (Stasko & Zhang, 2000)). These graphical representations display the details in such 
an hierarchical placement that relations between data elements can graphically be discovered.  
 
Treemaps display information about elements as rectangular blocks of which position, width, height and color 
are the main properties to represent characteristics of the data (see Fig. 17a). They make optimal use of the 
available space in the chart, because the whole chart is filled with information. However, the TreeMap 
visualization cannot optimally support the research into the PPM, because it focuses mostly on hierarchy and 
relative importance of the represented data elements. It has not been optimized to provide cognitive support for 
the recognition of patterns in the ordering of operations. Also Arctrees, Information Slices and Sunburst 
diagrams, which make use of a radial placement of information visualization elements, have the same 
shortcomings. 
 
Timeline Trees do include an explicit representation of order and timing of data elements grouped in categories. 
The hierarchy of the data categories is represented by a textual tree, and the timing of transactions for each of 
the data elements in a category is visualized by a timeline for each of the leaves of the tree (see Fig. 17b). The 
focus of the visualization is evenly spread over the hierarchy and the timing of data elements. For the PPM, this 
visualization can be used; although, in our opinion, the tree representation of the hierarchical structure of the 
data takes too much room and is distracting if the number of data categories increases. 
 
Other well-known visualizations focus less on the representation of hierarchy, but more on the timing of or the 
relation between the data elements (e.g., Gantt charts (Gantt, 1913) and Railroad line diagrams (Tufte, 1983)). 
Gantt charts are used in project planning to analyze phases, dependencies and timing of projects (Wilson, 2003). 
The different phases of the project are mentioned beneath each other. Besides each phase, a horizontal bar 
indicates the planned timeframe for each phase on the time axis (see Fig. 17c). The focus on the length of phases 
and dependencies between phases, and the lack of attention to optimally represented details of individual steps 
of each phase, makes them less suitable for the analysis of the PPM with regard to the discovery of useful 
insights at the level of patterns of individual operations of the modeler.  
 
Next, different informal Railroad line diagram visualizations exist to represent the routes and hour schedules of 
trains. They can be considered variants of, for example, Marey’s train schedule. The route of a train from one 
station to another is represented by a line that traverses the chart from left to right. Vertically the different 
stations are displayed and the horizontal axis represents a timeline (see Fig. 17d). This visualization is suitable 
for the display of information about an object of which the properties change in two dimensions (i.e., place and 
time), but does not allow for adding more dimensions of information easily without decreasing its cognitive 
effectiveness substantially, which would have been necessary to be used for the analysis of the PPM.  
 
24 
 
 
(a) TreeMap (from Johnson, 1993) 
(b) Timeline tree (from Burch et al., 2008) 
(c) Gantt chart (from SE blog15) 
(d) E.J. Marey’s train schedule (from Tufte, 1983) 
Fig. 17. Examples of process visualizations that are not considered to be traditional process models.
