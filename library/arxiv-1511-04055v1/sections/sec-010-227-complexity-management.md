---
doc_id: arxiv-1511-04055v1
doc_title: "A visual analysis of the process of process modeling 1 1 Introduction"
section_id: sec-010-227-complexity-management
section_title: "Complexity management"
section_number: 2.2.7
pages: 4-4
source_pdf: arxiv-1511-04055v1.pdf
source_sha256: 8201ed0c0ae78f46
toc_source: inferred
---
Complexity management 
To cope with perceptual and cognitive limits (Miller, 1956; Novak, 2002), it is encouraged to reduce complexity 
by modularization (divide the diagram in smaller subsystems) and hierarchical structuring (make separate 
diagrams of the same information at different levels of abstraction) (Moody, 2009; R. Weber, 1997). 
We suggest to only represent one PPM instance at a time in each chart. This way, the timelines can represent the 
different model elements (as in Fig. 1b), rather than different instances of the PPM (as in Fig. 1a). This can be 
achieved by splitting the event log in multiple event logs, each containing information about only one PPM 
instance. Further, it is possible in the Dotted Chart to customize the chart to abstract from certain differences or 
tailor the view to a certain analysis. All the same, complexity can further be reduced by filtering the displayed 
information. This can optimally be managed from within the plug-in, rather than at event log level (which is 
currently the only option in the Dotted Chart implementation).
