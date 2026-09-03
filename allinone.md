# arXiv Search Report: ZipTok3D

## Display All Results

Query: `ziptok3D`

Year range: 2024-2026

Source: arXiv

Results: 1 paper

| # | Title | Date | Venue | Citations | Score | Sources |
|---|---|---|---|---:|---:|---|
| [1](https://arxiv.org/abs/2609.01740) | ZipTok3D: High-Fidelity 3D Tokenization with Compact Token Prefixes | 2026-09-01 | arXiv | 0 | 4 | arXiv |

**Authors:** Mingda Lin, Weijie Wang, Zeyu Zhang, Bowen Cui, Yefei He, Haoyu Zhao, Yuanyu He, Donny Y. Chen, Feng Chen, Bohan Zhuang

**Abstract:** Compact token sequences are essential for efficient 3D generation. Existing 3D tokenizers organize latent representations over spatial regions or fixed-size global token sets, with reconstruction quality degrading sharply at very low token budgets. ZipTok3D organizes geometry into progressively informative global-token prefixes and unfolds compact representations through iterative decoding. Nested dropout trains each retained prefix to reconstruct the complete object, while a parameter-shared Transformer decoder repeatedly recovers fine-grained geometry. The method matches the reconstruction quality of a 32-token COD-VAE baseline with one token on ShapeNet and four on TRELLIS.

## Summary

### Overview

The query `ziptok3D` returned one exact arXiv match in the 2024-2026 window. It presents a compact 3D tokenizer focused on preserving reconstruction fidelity with extremely short token sequences.

### Trends

This single result does not support temporal or venue-level trend claims. Its emphasis reflects a broader direction toward reducing 3D representation length to improve downstream generation efficiency.

### Key Themes

- **Compact 3D tokenization:** reducing sequence length while preserving geometry (1).
- **Prefix-based representations:** placing the most informative geometry in early tokens (1).
- **Iterative decoding:** recovering detail with a shared Transformer decoder (1).

### Keywords Frequency

| Keyword | Count |
|---|---:|
| 3D | 1 |
| Tokenization | 1 |
| Token | 1 |
| Prefixes | 1 |
| Reconstruction | 1 |

### Most Cited by Accepted Paper

| Rank | Title | Year | Citations |
|---:|---|---:|---:|
| 1 | ZipTok3D: High-Fidelity 3D Tokenization with Compact Token Prefixes | 2026 | 0 |

### Most Cited by First Author

| Rank | Author | Papers in set | Total citations |
|---:|---|---:|---:|
| 1 | Mingda Lin | 1 | 0 |

### Recommendations for Reading

1. [ZipTok3D](https://arxiv.org/abs/2609.01740): read first for its compact-prefix tokenizer and low-token-budget reconstruction strategy.
