import React, { Component } from "react";

class Alpha2 extends Component {
  onFileChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log(fileReader.result);
    };
    fileReader.readAsText(file);
  }
  render() {
    return (
      <div>
        <input type="file" onChange={this.onFileChange.bind(this)} />
      </div>
    );
  }
}

export default Alpha2;
