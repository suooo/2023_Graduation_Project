import os
from flask_cors import CORS
from flask import Flask, jsonify, request


app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)


@app.route("/")
def test():
    return "default page"


@app.route("/react_to_flask", methods=["POST"])
def react_to_flask():
    parsed_request = request.files.get("file")
    fileName = request.form.get("fileName")

    dir_path = os.path.dirname(os.path.realpath(__file__))
    dir_path = dir_path + "\data"
    saved_file_path = os.path.join(dir_path, fileName)
    parsed_request.save(saved_file_path)  # saved_file_path 경로에 받은 file 저장

    data = jsonify(data)
    return data


@app.route("/upload", methods=["POST"])
def upload_file():
    uploaded_file = request.files["file"]
    if uploaded_file:
        file_content = uploaded_file.read()
        return jsonify(
            {
                "message": "File uploaded successfully",
                "content": file_content.decode("utf-8"),
            }
        )
    else:
        return jsonify({"error": "No file uploaded"})


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(port="5000", debug=True)
