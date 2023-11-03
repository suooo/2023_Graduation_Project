# About Language Model

한국어 기반 언어 모델인 [KoBERT](https://github.com/SKTBrain/KoBERT)를 사용했다.

PyTorch와 [Huggingface transformers API](https://github.com/SKTBrain/KoBERT/tree/master/kobert_hf)를 사용, Colab에서 진행했다.

학습 완료된 모델은 다음 코드를 통해 Colab에서 내보낸 후 모델을 사용할 환경에서 불러와 사용한다.

    torch.save(model, f'./kobert_model.pt')
