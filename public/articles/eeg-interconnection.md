### Summary

Understanding how different areas of the brain interact and coalesce into perception, thought, and action is an active area of research regarding this core question of neuroscience. In this survey, we look at the process to extract relevant data from one EEG dataset. We then consider potential computational algorithms to derive temporal connections between brain areas (as dictated by electrode positions). Finally, we conclude with overall results on connectivity metrics across algorithms and provide a comparison with existing insights and data on the subject.

### Datasets of Interest

This survey consisted of data from one dataset:

| Name | Source | Participants | Channels | Sampling Rate | Tasks | Format |
|---------|--------|--------------|----------|---------------|----------|--------|
| EEG Motor Movement/Imagery | PhysioNet[^1], BCI2000[^2] | 109 | 64 | 160 Hz | Motor execution/imagery | .edf |

The rationale behind this selection was to 1) utilize a vast, relatively random array of people and demographics, and 2) work with neural activity in various states of alertness and activity.

### EEG Data Extraction and Processing

The extraction script was written in Python 3.XX and used the mne library to parse EEG-containing files (principally .edf). From here, for each channel combination (2 channels, A and B), across several lag positions, the pearson coefficient (via scipy) between A and B's signals is calculated across the entire timeframe. Lag positions here refer to the relative offset between a datapoint in channel A and channel B. For example, given a lag of 5, B's signals are shifted 5 to the left, and the last 5 signals of A are discarded. These modified vectors are then fed into the correlation function. For our purposes, we processed the EEG with lag values from 2-30 (equivalent to 58~188ms, depending on the sampling rate).

For each channel pair, the script outputs a set of CSV files containing the statistical descriptions on two versions of the temporal data: absolute and delta. The absolute version contains the untouched EEG signals whose correlation is directly calculted. The delta version, on the other hand, calculates the correlation between the change in EEG signals between every N consecutive points (N being the current lag value under calculation). For example, the correlation of deltas with lag $N = 10$ looks like so: 

$corr(\{A_2 - A_1, A_3 - A_2, A_4 - A_3, ...\}, \{B_{12} - B_{11}, B_{13} - B_{12}, B_{14} - B_{13}, ...\})$ 

The resulting statistic and p-value are included in the output.

The above process is very computationally expensive as it quadratic on the number of channels and generally inputs large signal vectors into the correlation function. We used multithreading on a 16-Core Intel CPU setup to expedite the process, but the program still ran for around 3 days for just the EEG Motor Movement/Imagery dataset. This bottleneck is an area for improvement, pending potential optimizations based around the specific features being extracted.

### Comparison of Connectivity Algorithms

### Connectivity Evaluation Process

### Results

### Consistency with Existing Data

[^1] Goldberger, A., Amaral, L., Glass, L., Hausdorff, J., Ivanov, P. C., Mark, R., ... & Stanley, H. E. (2000). PhysioBank, PhysioToolkit, and PhysioNet: Components of a new research resource for complex physiologic signals. Circulation [Online]. 101 (23), pp. e215–e220. RRID:SCR_007345. Retrieved from https://physionet.org/content/eegmmidb/1.0.0/S001

[^2] Schalk, G., McFarland, D.J., Hinterberger, T., Birbaumer, N., Wolpaw, J.R. BCI2000: A General-Purpose Brain-Computer Interface (BCI) System. IEEE Transactions on Biomedical Engineering 51(6):1034-1043, 2004.