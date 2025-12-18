### Summary

Understanding how different areas of the brain interact and coalesce into perception, thought, and action is an active area of research regarding this core question of neuroscience. In this survey, we look at the process to extract relevant data from one EEG dataset. We then consider the potential computational algorithms to in order to derive temporal connections between brain areas (as dictated by electrode positions) and derive comparisons between them. Finally, we conclude with overall results on connectivity across algorithms and provide comparison with existing data on the subject.

### Datasets of Interest

This survey consisted of data from one dataset:

| Name | Source | Participants | Channels | Sampling Rate | Tasks | Format |
|---------|--------|--------------|----------|---------------|----------|--------|
| EEG Motor Movement/Imagery | PhysioNet[^1], BCI2000[^2] | 109 | 64 | 160 Hz | Motor execution/imagery | .edf |

The rationale behind this selection was to 1) utilize a vast, relatively random array of people and demographics, and 2) work with neural activity in various states of alertness and activity.

### EEG Data Extraction and Processing

The extraction script was written in Python 3.XX and used the mne library to parse EEG-containing files (principally .edf). From here, for each channel combination (2 channels, A and B), across several lag positions, the perason coefficient (via scipy) between A and B's signals is calculated across the entire timeframe. Lag positions here refer to the relative offset between a datapoint in channel A and channel B. For example, given a lag of 5, B's signals are shifted 5 to the left, and the last 5 signals of A are discarded. These modified vectors are then fed into the correlation function. For our purposes, we processed the EEG with a maximum lag of 30 (equivalent to ~188ms with a standard 160hz EEG input).

### Comparison of Connectivity Algorithms

### Connectivity Evaluation Process

### Results

### Consistency with Existing Data

[^1] Goldberger, A., Amaral, L., Glass, L., Hausdorff, J., Ivanov, P. C., Mark, R., ... & Stanley, H. E. (2000). PhysioBank, PhysioToolkit, and PhysioNet: Components of a new research resource for complex physiologic signals. Circulation [Online]. 101 (23), pp. e215–e220. RRID:SCR_007345.

[^2] Schalk, G., McFarland, D.J., Hinterberger, T., Birbaumer, N., Wolpaw, J.R. BCI2000: A General-Purpose Brain-Computer Interface (BCI) System. IEEE Transactions on Biomedical Engineering 51(6):1034-1043, 2004.