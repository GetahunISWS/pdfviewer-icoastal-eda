import { useEffect, useState } from "react";
import "./App.css";
import { Form } from "react-bootstrap";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import hcbgImage from "./CoverPhotoByAtticus.jpg";
import logof from "./ISWSLogo.PNG";

import {
  getParametersNames,
  getWaterParametersNames,
  getWaterParameterCode,
  getParameterCode,
  getStationNames,
  getTrendParametersNames,
  getTrendPeriodNames,
  getTrendParameterCode
} from "./Utils/utils";

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

export default function App() {
  const [stationNames, setStationNames] = useState(null);
  const [waterParameter, setWaterParameter] = useState(null);

  const [selectedStationName, setSelectedStationName] = useState("");
  const [selectedWaterParameterName, setSelectedWaterParameterName] =
    useState("");

  const [parameterNames, setParameterNames] = useState(null);
  const [selectedParameterName, setSelectedParameterName] = useState("");

  const [recordCode, setRecordCode] = useState(0);
  const [waterRecordCode, setWaterRecordCode] = useState(0);
  const [pdfName, setPdfName] = useState("");
  const [waterPdfName, setWaterPdfName] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber,setPage] = useState(1);

  const [periodNames, setPeriodNames] = useState(null);
  const [trendParameter, setTrendParameter] = useState(null);
  const [selectedPeriodName, setSelectedPeriodName] = useState("");
  const [selectedTrendParameterName, setSelectedTrendParameterName] =
    useState("");
  const [trendRecordCode, settrendRecordCode] = useState(0);
  const [trendPdfName, settrendPdfName] = useState("");


  useEffect(() => {
      getTrendParametersNames().then((data) => {
          setTrendParameter(data);
      });
  }, []);

  useEffect(() => {
      if (selectedTrendParameterName && selectedTrendParameterName.length > 0) {
          console.log({ trendParameter });
          getTrendPeriodNames(selectedTrendParameterName)
            .then((data) => {
                console.log(data);
                setPeriodNames(data);
            })
            .catch((err) => console.log(err));
      }
  }, [selectedTrendParameterName]);

  useEffect(() => {
      if (setSelectedPeriodName && selectedTrendParameterName) {
          getTrendParameterCode(selectedPeriodName, selectedTrendParameterName).then(
            ([paramCode, trendRecordCode]) => {
                settrendRecordCode(trendRecordCode);
                console.log(paramCode, trendRecordCode);
            }
          );
      }
  }, [selectedPeriodName, selectedTrendParameterName]);

  useEffect(() => {
    getParametersNames().then((data) => {
      setParameterNames(data);
    });
  }, []);

  useEffect(() => {
    getWaterParametersNames().then((data) => {
      setWaterParameter(data);
    });
  }, []);

  useEffect(() => {
    if (selectedParameterName && selectedParameterName.length > 0) {
      console.log({ parameterNames });
      getStationNames(selectedParameterName)
        .then((data) => {
          console.log(data);
          setStationNames(data);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedParameterName]);

  useEffect(() => {
    if (selectedStationName && selectedParameterName) {
      getParameterCode(selectedStationName, selectedParameterName).then(
        ([paramCode, recordCode]) => {
          setRecordCode(recordCode);
          console.log(paramCode, recordCode);
        }
      );
    }
  }, [selectedStationName, selectedParameterName]);

  useEffect(() => {
    if (selectedWaterParameterName) {
      getWaterParameterCode(selectedWaterParameterName).then((recordCode) => {
        setWaterRecordCode(recordCode);
        console.log(recordCode);
      });
    }
  }, [selectedWaterParameterName]);


  useEffect(() => {
    setPdfName(`${recordCode}_EDAplots.pdf`);
  }, [recordCode]);

  useEffect(() => {
    setWaterPdfName(`${waterRecordCode}_Factsheet.pdf`);
  }, [waterRecordCode]);

  useEffect(() => {
      settrendPdfName(`${trendRecordCode}.pdf`);
  }, [trendRecordCode]);

  const handleStationNameSelect = (event) => {
    const { value } = event.target;
    setSelectedStationName(value);
  };

  const handlePeriodNameSelect = (event) => {
      const { value } = event.target;
      setSelectedPeriodName(value);
  };

  const handleParameterNameChange = (event) => {
    const { value } = event.target;
    setSelectedParameterName(value);
    setWaterRecordCode("");
  };

  const handleTrendParameterNameChange = (event) => {
      const { value } = event.target;
      setSelectedTrendParameterName(value);
      settrendRecordCode("");
  };

  const handleWaterParameterNameChange = (event) => {
    const { value } = event.target;
    setSelectedWaterParameterName(value);
    setRecordCode("");
    setPage(1);
  };

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (
    <div className="App" style={{fontFamily: "Verdana", textAlign:"center", backgroundImage: 'url('+hcbgImage+')', backgroundColor: "transparent", backgroundSize:"cover"}}>
      <h2 style={{backgroundColor: "#FF5F0F", color: "white"}}>Water Quality Trends in the Illinois Coastal Zone</h2>
      <div style={{float:"left"}}>
        <img src={logof}/>
      </div>
      <br/><br/><br/> <br/>  <br/>
      <div>
        <h3 style={{color: "#13294b"}}>EDA Outputs for Water Quality Constituents </h3>
        {parameterNames && parameterNames !== null ? (
          <Form.Select
            aria-label="Parameter Names"
            data-live-search="true"
            onChange={handleParameterNameChange}
          >
            <option key="parameter_default" selected disabled>
              Select Parameter
            </option>
            {parameterNames.map((name, i) => (
              <option value={name} key={i}>
                {name}
              </option>
            ))}
          </Form.Select>
        ) : (
          <></>
        )}

        {stationNames && stationNames !== null ? (
          <Form.Select
            aria-label="station Name"
            data-live-search="true"
            onChange={handleStationNameSelect}
          >
            <option key="station_default" selected disabled>
              Select Station
            </option>
            {stationNames.map((name, i) => (
              <option value={name} key={i}>
                {name}
              </option>
            ))}
          </Form.Select>
        ) : (
          <></>
        )}
      </div>


    <br/>


        {recordCode !== "" && recordCode? (
          <div style={{display:"flex", justifyContent:"center"}}>
            <Document
              file={`${process.env.PUBLIC_URL}/results/${pdfName}`}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
            >
              {
                Array.from(
                  new Array(numPages),
                  (el, index) => (
                    <Page
                      scale={100/72}
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                    />
                  ),
                )
              }
            </Document>
          </div>
        ) : (
          <></>
        )}

    
    </div>
  );
}