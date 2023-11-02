from flask import Flask, request, jsonify, g
from flask_cors import CORS
from flask_restful import Api

import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader
import gluonnlp as nlp
import numpy as np
from kobert_tokenizer import KoBERTTokenizer

from konlpy.tag import Komoran
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)
api = Api(app)


class BERTDataset(Dataset):
    def __init__(
        self, dataset, sent_idx, label_idx, bert_tokenizer, vocab, max_len, pad, pair
    ):
        transform = nlp.data.BERTSentenceTransform(
            bert_tokenizer, max_seq_length=max_len, vocab=vocab, pad=pad, pair=pair
        )

        self.sentences = [transform([i[sent_idx]]) for i in dataset]
        self.labels = [np.int32(i[label_idx]) for i in dataset]

    def __getitem__(self, i):
        return self.sentences[i] + (self.labels[i],)

    def __len__(self):
        return len(self.labels)


class BERTClassifier(nn.Module):
    def __init__(
        self,
        bert,
        hidden_size=768,
        num_classes=7,  # 감정 클래스 수로 조정
        dr_rate=None,
        params=None,
    ):
        super(BERTClassifier, self).__init__()
        self.bert = bert
        self.dr_rate = dr_rate

        self.classifier = nn.Linear(hidden_size, num_classes)
        if dr_rate:
            self.dropout = nn.Dropout(p=dr_rate)

    def gen_attention_mask(self, token_ids, valid_length):
        attention_mask = torch.zeros_like(token_ids)
        for i, v in enumerate(valid_length):
            attention_mask[i][:v] = 1
        return attention_mask.float()

    def forward(self, token_ids, valid_length, segment_ids):
        attention_mask = self.gen_attention_mask(token_ids, valid_length)

        _, pooler = self.bert(
            input_ids=token_ids,
            token_type_ids=segment_ids.long(),
            attention_mask=attention_mask.float().to(token_ids.device),
            return_dict=False,
        )
        if self.dr_rate:
            out = self.dropout(pooler)
        return self.classifier(out)


def my_predict(predict_sentence):
    device = torch.device("cuda:0")
    tokenizer = KoBERTTokenizer.from_pretrained("skt/kobert-base-v1")
    vocab = nlp.vocab.BERTVocab.from_sentencepiece(
        tokenizer.vocab_file, padding_token="[PAD]"
    )
    tok = nlp.data.BERTSPTokenizer(tokenizer, vocab, lower=False)
    tok = tokenizer.tokenize

    max_len = 64
    batch_size = 64

    data = [predict_sentence, "0"]
    dataset_another = [data]

    another_test = BERTDataset(
        dataset_another, 0, 1, tok, vocab, max_len, True, False
    )  # 토큰화한 문장
    test_dataloader = torch.utils.data.DataLoader(
        another_test, batch_size=batch_size, num_workers=5
    )  # torch 형식 변환

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = torch.load("kobert_model.pt", map_location=device)
    # print(model)
    model.eval()

    for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(
        test_dataloader
    ):
        token_ids = token_ids.long().to(device)
        segment_ids = segment_ids.long().to(device)

        valid_length = valid_length
        label = label.long().to(device)

        out = model(token_ids, valid_length, segment_ids)

        test_eval = []
        for i in out:  # out = model(token_ids, valid_length, segment_ids)
            logits = i
            logits = logits.detach().cpu().numpy()

            if np.argmax(logits) == 0:
                test_eval.append("공포")
            elif np.argmax(logits) == 1:
                test_eval.append("놀람")
            elif np.argmax(logits) == 2:
                test_eval.append("분노")
            elif np.argmax(logits) == 3:
                test_eval.append("슬픔")
            elif np.argmax(logits) == 4:
                test_eval.append("중립")
            elif np.argmax(logits) == 5:
                test_eval.append("행복")
            elif np.argmax(logits) == 6:
                test_eval.append("혐오")

        return test_eval[0]


# client에서 받아오는 채팅 내용
sentence = []

# 대화 상대의 긍정적인 채팅 내용
result_sentences = []


@app.route("/post", methods=["POST"])
def post():
    global sentence
    message = request.get_json()
    chat = message.get("message", "")

    for c in chat:
        sentence.append(c)

    print("\n------------POST------------")
    for index, value in enumerate(sentence):
        print("sentence", index, " : ", value)
    print("----------------------------")

    return "Complete post"


@app.route("/predict", methods=["GET"])
def predict():
    global sentence
    global result_sentences
    tmp_r_s = []

    for i in sentence:
        result = my_predict(i)
        print("------------GET-------------")
        print("sentence : " + i)
        print(result)
        print("----------------------------\n")
        if result == "행복":
            tmp_r_s.append(i)

    tmp = set(tmp_r_s)  # 중복 제거
    for t in list(tmp):
        result_sentences.append(t.strip())  # 문장 끝의 '\n' 제거

    print("----------------------------")
    for index, value in enumerate(result_sentences):
        print("result sentence", index, " : ", value)
    print("----------------------------\n")

    komoran = Komoran()
    key_Nouns = []
    for r in result_sentences:
        key_Nouns.extend(komoran.nouns(r))

    rslt = {"rs": result_sentences, "kw": key_Nouns}
    print(rslt)

    return json.dumps(rslt)


def on_json_loading_failed_return_dict(e):
    return {}


if __name__ == "__main__":
    app.run(debug=True)
