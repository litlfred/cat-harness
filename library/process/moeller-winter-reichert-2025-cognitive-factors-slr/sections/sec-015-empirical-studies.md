---
doc_id: moeller-winter-reichert-2025-cognitive-factors-slr
doc_title: "Cognitive Factors in Process Model Comprehension—A Systematic Literature Review"
section_id: sec-015-empirical-studies
section_title: "Empirical Studies"
section_number: null
pages: 14-17
source_pdf: moeller-winter-reichert-2025-cognitive-factors-slr.pdf
source_sha256: 5a59dae7dac74179
toc_source: outline
---
This subsection deals with the methodologies from cognitive neuroscience and cogni-
tive psychology examined in the studies.
Methodologies from Cognitive Neuroscience: Sensor technologies from cognitive neu-
roscience were used by 19 studies (i.e., 46.3% of the empirical studies). Out of the 19 studies,
18 of them used eye tracking and one employed the method of electrodermal activity. None
of the selected studies relied on advanced neuroimaging and electrophysiological methods
like fMRI, EEG, MEG, or EMG.
Eye Tracking. Eye tracking is a technique used to study visual attention by tracking
where and for how long a person looks at specific objects. It also records the scan path,
Brain Sci. 2025, 15, 505
15 of 31
showing the sequence of eye movements. This method is applied in fields such as cognitive
psychology, marketing, and human–computer interaction (including human factors). In
user experience research, eye tracking helps gain insights into user interactions that cannot
be captured through verbal descriptions alone [85].
In the literature review [86], which focuses on the use of eye tracking, four metrics
were considered: fixations, saccades, scan path, and duration. These metrics, except for
duration, were identified and considered in our SLR (see Table 4) as well. Duration was not
considered, as it does not necessarily constitute a metric associated with eye tracking. This
aligns with the findings reported by [87], which describe these three metrics as the most
frequently ones used in the context of eye tracking.
Table 4. Eye-tracking metrics used by studies.
Study
Source
Fixations
Saccades
Scan Path
S1
[13]
✓
✓
S2
[41]
✓
✓
✓
S3
[42]
✓
✓
✓
S4
[43]
✓
✓
✓
S6
[45]
✓
S9
[48]
✓
S10
[49]
✓
✓
S11
[50]
✓
S12
[51]
✓
✓
✓
S15
[54]
✓
S16
[55]
✓
S24
[63]
✓
S27
[65]
✓
S30
[68]
✓
✓
S35
[73]
✓
✓
S37
[75]
✓
S40
[78]
✓
✓
S47
[84]
✓
In all studies that used eye tracking, fixations were measured, either as the number
of fixations or the fixation duration. A fixation happens when the eye stops moving
and focuses on a specific spot in the visual field [85]. In five studies, in addition to the
measurement of fixations, saccades were examined. Saccades constitute rapid shifts of the
eye from one point to another, which help when piecing together a complete image of the
viewed scene [85]. Emphasized by Study S1 [13], it is important to understand that during
saccadic eye movements, the eye does not capture any visual input. In nearly half of all
studies that used eye tracking, the scan path was applied as a metric. A scan path (or gaze
path) shows the route the eyes follow, including the sequence of fixations and saccades.
This scan path can reveal how visual information is processed.
Electrodermal activity. Study S8 [47] explored whether electrodermal activity can be
used to assess cognitive load during process model comprehension. A preliminary test run
is performed as well as a feasibility study with nine participants who had to understand
two different BPMN 2.0 process models while recording their electrodermal activity. S8
Brain Sci. 2025, 15, 505
16 of 31
measured the mean skin conductance level (SCL) to assess variations in physiological
arousal during the comprehension of process models, indicating whether different levels
of complexity lead to increased cognitive load. The number of skin conductance response
(SCR) peaks was analyzed to identify moments of high physiological or psychological
demand, evaluating whether more peaks occurred with increasing complexity of the models.
Additionally, the mean of SCR amplitudes energy level was measured to determine the
level of stress caused by the task of comprehending process models. In this context, higher
amplitudes signify greater cognitive load.
Methodologies from Cognitive Psychology. Out of the 41 empirical studies, 37 use
(methodological) theories from cognitive psychology. Table 5 shows the distribution of the
theories across the studies. In all studies, CLT (see Section 2.4) was used. The second most
frequently used theory was CTML (S22, S24, S38, S44, S45, S47), followed by TAM (S7, S8,
S11, S12, S15, S16). Finally, CFT was utilized by the empirical studies (S24, S26, S40, S45,
S47), as well as DCT (S38, S45).
Table 5. Methodological theories.
Study
Source
CLT
TAM
CTML
CFT
DCT
S1
[13]
✓
S2
[41]
✓
S3
[42]
✓
S4
[43]
✓
S5
[44]
✓
S6
[45]
✓
S7
[46]
✓
✓
S8
[47]
✓
✓
S9
[48]
✓
S10
[49]
✓
S11
[50]
✓
✓
S12
[51]
✓
✓
S15
[54]
✓
✓
S16
[55]
✓
✓
S17
[56]
✓
S22
[61]
✓
✓
S24
[63]
✓
✓
✓
S26
[64]
✓
✓
S27
[65]
✓
S28
[66]
✓
S45
[82]
✓
✓
✓
✓
S46
[83]
✓
S29
[67]
✓
S31
[69]
✓
S32
[70]
✓
S33
[71]
✓
S34
[72]
✓
Brain Sci. 2025, 15, 505
17 of 31
Table 5. Cont.
Study
Source
CLT
TAM
CTML
CFT
DCT
S35
[73]
✓
S36
[74]
✓
S37
[75]
✓
S38
[76]
✓
✓
✓
S40
[78]
✓
✓
S42
[79]
✓
S44
[81]
✓
✓
S47
[84]
✓
✓
✓
Notation. The empirical studies were analyzed based on the notation used. The
notations were split into three categories: BPMN, Non-BPMN, and Both. Note that BPMN
2.0 is a de facto industry standard (ISO/IEC 19510:2013 [88] norm) for creating and visu-
alizing process models, which is broadly used in both industry and academics. The first
category included all studies that use BPMN (including its current version, BPMN 2.0).
The second category, Non-BPMN, comprised all studies that did not employ BPMN but
instead examined other notations such as Event-driven Process Chains (EPC), Yet Another
Workflow Language (YAWL), and Unified Modeling Language activity diagrams (UML
AD). These notations were explicitly analyzed to allow for a comparative perspective on the
cognitive effects across different modeling languages. The last category included studies
that examined both BPMN and other notations.
Table 6 shows the distribution of the studies by notation. The majority of empirical
studies consider BPMN (i.e., 70.7% of the empirical studies analyzed). A small portion
of the research, comprising four studies, used notations other than BPMN. This accounts
for 9.8% of the total studies. There are eight studies that employed both BPMN and other
notations, making up 19.5% of the empirical studies analyzed.
Table 6. Studies distribution by notation.
Notation
Source
# Studies (%)
BPMN
S1 [13], S4 [43], S6 [45], S7 [46], S8 [47], S9 [48], S10 [49],
S11 [50], S12 [51], S14 [53], S15 [54], S16 [55], S22 [61],
S24 [63], S26 [64], S27 [65], S28 [66], S29 [67], S30 [68],
S32 [70], S33 [71], S34 [72], S35 [73], S36 [74], S37 [75],
S38 [76], S40 [78], S46 [83], S41 [29]
29 (70.7)
Non-BPMN
S3 [42], S18 [57], S31 [69], S43 [80]
4 (9.8)
Both
S2 [41], S5 [44], S17 [56], S39 [77], S42 [79], S44 [81],
S45 [82], S47 [84]
8 (19.5)
