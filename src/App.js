import React, { useState, useRef } from "react";

import XLSX from "xlsx";

function FileUploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const uploadDiv = useRef(null);
  const [records, setRecords] = useState([]);

  const processExcel = (data) => {
    const workbook = XLSX.read(data, { type: "binary" });
    const firstSheet = workbook.SheetNames[0];
    const excelRows = XLSX.utils.sheet_to_row_object_array(
      workbook.Sheets[firstSheet]
    );

    setRecords(excelRows);
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    const fileUpload = uploadDiv.current;
    const regex = /([a-zA-Z0-9\s_\\.\-:\(\)])+(.xls|.xlsx)$/;
    console.log(uploadDiv.current.value);
    if (regex.test(uploadDiv.current.value.toLowerCase())) {
      if (typeof FileReader !== "undefined") {
        const reader = new FileReader();
        if (reader.readAsBinaryString) {
          reader.onload = (e) => {
            processExcel(reader.result);
          };
          reader.readAsBinaryString(fileUpload.files[0]);
        }
      } else {
        console.log("This browser does not support HTML5.");
      }
    } else {
      console.log("Please upload a valid Excel file.");
    }
    setIsSelected(false);
  };

  return (
    <div>
      <input ref={uploadDiv} type="file" name="file" onChange={changeHandler} />
      {isSelected ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}

      {!!records?.length && (
        <table>
          <thead>
            {Object.keys(records[0]).map((keyValue) => {
              return <td>{keyValue.toUpperCase()}</td>;
            })}
          </thead>
          <tbody>
            {records.map((record, key) => {
              return (
                <tr>
                  {Object.keys(record).map((keyValue) => {
                    console.log(record[keyValue], record);
                    return (
                      <td>
                        {typeof record[keyValue] !== "undefined"
                          ? record[keyValue]
                          : "*"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FileUploadPage;
