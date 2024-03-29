// import { useFormik } from "formik";
import "./App.css";
import Header from "./Header";
// import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Button, Slider, TextField } from "@mui/material";
import marks from "./marks";
import { all, create, eigs, i, map, zeros } from "mathjs";
import { determinant, EigenvalueDecomposition, Matrix } from "ml-matrix";
import Display from "./components/Display";
import imgSelector from "./utils/img_selector";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

const math = create(all);
let p = 0;
let q = 0;
const matrix = Matrix.zeros(2, 2);
const eigenspace_1 = Matrix.zeros(2, 2);
const eigenspace_2 = Matrix.zeros(2, 2);
const eigenvector_1 = Matrix.zeros(2, 1);
const eigenvector_2 = Matrix.zeros(2, 1);
let url = null;

export default function App() {
  const [a_value, setAValue] = useState(0);
  const [b_value, setBValue] = useState(0);
  const [c_value, setCValue] = useState(0);
  const [d_value, setDValue] = useState(0);

  const [eigenvalues, setEVas] = useState();
  const [flag, setFlag] = useState(null);

  const [submission, setSubmission] = useState(false);

  const [isImaginary, setIsImaginary] = useState(false);

  function get_EVXs() {
    setFlag(null);
    setIsImaginary(false);

    matrix.set(0, 0, a_value);
    matrix.set(0, 1, b_value);
    matrix.set(1, 0, c_value);
    matrix.set(1, 1, d_value);

    // console.log(matrix);

    p = matrix.trace();
    q = determinant(matrix);

    // setEV1(math.eigs(matrix, 3));

    let eigen_decomp = new EigenvalueDecomposition(matrix);
    let aux = eigen_decomp.realEigenvalues;
    aux.forEach((element) => {
      let index = aux.indexOf(element);
      if (index !== -1) aux[index] = element.toFixed(2);
    });

    setEVas(aux);
    eigenspace_1.add(matrix);
    eigenspace_2.add(matrix);

    let scope = {
      x: p,
    };

    if (q > math.evaluate("(x^2)/4", scope)) {
      // alert(eigen_decomp.imaginaryEigenvalues);
      setIsImaginary(true);
      setSubmission(true);
      setFlag(0);
    }
    console.log(isImaginary);

    eigenspace_1.set(0, 0, (a_value - aux[0]).toFixed(2));
    eigenspace_1.set(0, 1, b_value.toFixed(2));
    eigenspace_1.set(1, 0, c_value.toFixed(2));
    eigenspace_1.set(1, 1, (d_value - aux[0]).toFixed(2));

    eigenspace_2.set(0, 0, (a_value - aux[1]).toFixed(2));
    eigenspace_2.set(0, 1, b_value.toFixed(2));
    eigenspace_2.set(1, 0, c_value.toFixed(2));
    eigenspace_2.set(1, 1, (d_value - aux[1]).toFixed(2));

    url = imgSelector(aux, p, q);
    console.log(eigenspace_1);

    // lambda1 = "\begin {pmatrix} a & b\\ c & d\\ end{pmatrix}";
    // setEVes(eigen_decomp.eigenvectorMatrix);
    setSubmission(true);
  }

  function check_eigenvectors() {
    setFlag(0);

    let zero = Matrix.zeros(2, 1);

    console.log("Matriz esperada: " + zero);
    console.log("EA 1: " + eigenspace_1);
    console.log("EA 2: " + eigenspace_2);
    console.log("EV 1: " + eigenvector_1);
    console.log("EV 2: " + eigenvector_2);

    let a_lambda1 = new Matrix(eigenspace_1.mmul(eigenvector_1));
    let a_lambda2 = new Matrix(eigenspace_2.mmul(eigenvector_2));
    console.log(a_lambda1);
    console.log(a_lambda2);

    let flagA = 0;
    let flagB = 0;
    for (let i = 0; i < 1; i++) {
      const element = a_lambda1.getRow(i)[0].toFixed(2);
      console.log(element);
      if (element != 0) flagA = 1;
    }
    for (let i = 0; i < 1; i++) {
      const element = a_lambda2.getRow(i)[0].toFixed(2);
      console.log(element);
      if (element != 0) flagB = 2;
    }
    setFlag(flagA + flagB);
    console.log(flag);
    return flag;
  }

  useEffect(() => {
    setFlag(null);
    // console.log("Autovector 1: " + eigenspace_1);
    // console.log("Autovector 2: " + eigenspace_2);
  }, []);

  function valueText(value) {
    return `${value}°C`;
  }

  function renderFlag() {
    switch (flag) {
      case 0:
        return null;
        break;

      case 1:
        return <h6>El autovector 1 NO da una matriz nula</h6>;
        break;

      case 2:
        return <h6>El autovector 2 NO da una matriz nula</h6>;
        break;

      case 3:
        return <h6>Ambos autovectores NO dan una matriz nula</h6>;
        break;
    }
  }

  return (
    <MathJaxContext version={3} config={config}>
      <div className="App">
        <Header />
        <div className="body">
          <div className="inputs">
            <h2>Sección de Inputs</h2>
            <div className="slider">
              <subtitle>
                Especifique los siguientes valores de la Matriz A
              </subtitle>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                  marginTop: "10px",
                }}
              >
                <text style={{ marginRight: "20px" }}>a)</text>
                <Slider
                  id="a"
                  name="a"
                  aria-label="a value"
                  getAriaValueText={valueText}
                  marks={marks}
                  step={0.25}
                  min={-5}
                  max={5}
                  defaultValue={0}
                  onChange={(event, newNumber) => setAValue(newNumber)}
                  // error={formik.touched.a && formik.errors.a}
                  // helperText={formik.touched.a && formik.errors.a}
                  valueLabelDisplay="auto"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                }}
              >
                <text style={{ marginRight: "20px" }}>b)</text>

                <Slider
                  id="b"
                  name="b"
                  aria-label="b value"
                  getAriaValueText={valueText}
                  marks={marks}
                  step={0.25}
                  min={-5}
                  max={5}
                  defaultValue={0}
                  onChange={(event, value) => setBValue(value)}
                  // error={formik.touched.a && formik.errors.a}
                  // helperText={formik.touched.a && formik.errors.a}
                  valueLabelDisplay="auto"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                }}
              >
                <text style={{ marginRight: "20px" }}>c)</text>
                <Slider
                  id="c"
                  name="c"
                  aria-label="c value"
                  getAriaValueText={valueText}
                  marks={marks}
                  step={0.25}
                  min={-5}
                  max={5}
                  defaultValue={0}
                  onChange={(event, value) => setCValue(value)}
                  // error={formik.touched.a && formik.errors.a}
                  // helperText={formik.touched.a && formik.errors.a}
                  valueLabelDisplay="auto"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                }}
              >
                <text style={{ marginRight: "20px" }}>d)</text>
                <Slider
                  id="d"
                  name="d"
                  aria-label="d value"
                  getAriaValueText={valueText}
                  marks={marks}
                  step={0.25}
                  min={-5}
                  max={5}
                  defaultValue={0}
                  onChange={(event, value) => setDValue(value)}
                  // error={formik.touched.a && formik.errors.a}
                  // helperText={formik.touched.a && formik.errors.a}
                  valueLabelDisplay="auto"
                />
              </div>
            </div>

            <Button
              variant="contained"
              onClick={() => get_EVXs()}
              // onSubmit={formik.handleSubmit}
              style={{ margin: "10px 0 15px 0" }}
            >
              Calcular Autovalores y autovectores
            </Button>
            {!submission ? null : (
              <>
                <MathJax>
                  {
                    "\\(\\LARGE \\sigma\\scriptstyle (A) \\displaystyle = \\lbrace \\lambda_1 =\\)"
                  }{" "}
                  {eigenvalues[0]} {"\\(; \\lambda_2 =\\)"} {eigenvalues[1]}{" "}
                  {"\\(\\rbrace \\)"}
                </MathJax>

                <div className="autoparameters">
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "225px",
                        alignItems: "center",
                      }}
                    >
                      <h3>
                        <MathJax>
                          {
                            "\\(\\small S_{\\lambda _1} = Nul \\lbrace A - \\lambda_1 \\times I \\rbrace \\)"
                          }
                        </MathJax>
                      </h3>
                      <subtitle>
                        <MathJax dynamic={true}>
                          {"\\(\\begin{pmatrix} "} {eigenspace_1.data[0][0]}{" "}
                          {" & "}
                          {eigenspace_1.data[0][1]}
                          {"\\\\"}
                          {eigenspace_1.data[1][0]}
                          {"&"}
                          {eigenspace_1.data[1][1]}
                          {"\\ \\end{pmatrix}\\)"}
                        </MathJax>
                      </subtitle>
                      <div
                        style={{
                          flexDirection: "row",
                          paddingLeft: "5px",
                          paddingRight: "5px",
                        }}
                      >
                        <TextField
                          type={"number"}
                          variant="filled"
                          id="eigenvalue_1-x"
                          name="eigenvalue_1-x"
                          label="Autovector 1-x"
                          onChange={(event) =>
                            eigenvector_1.set(0, 0, event.target.value)
                          }
                          // error={formik.touched.a && formik.errors.a}
                          // helperText={formik.touched.a && formik.errors.a}
                          valueLabelDisplay="auto"
                          disabled={isImaginary}
                        />

                        <TextField
                          type={"number"}
                          variant="filled"
                          id="eigenvalue_1-y"
                          name="eigenvalue_1-y"
                          label="Autovector 1-y"
                          onChange={(event) =>
                            eigenvector_1.set(1, 0, event.target.value)
                          }
                          // error={formik.touched.a && formik.errors.a}
                          // helperText={formik.touched.a && formik.errors.a}
                          disabled={isImaginary}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "225px",
                        alignItems: "center",
                      }}
                    >
                      <h3>
                        <MathJax read-only>
                          {
                            "\\(\\small S_{\\lambda _2} = Nul \\lbrace A - \\lambda_2 \\times I \\rbrace \\)"
                          }
                        </MathJax>
                      </h3>
                      <subtitle>
                        <MathJax dynamic={true}>
                          {"\\(\\begin{pmatrix} "} {eigenspace_2.data[0][0]}{" "}
                          {" & "}
                          {eigenspace_2.data[0][1]}
                          {"\\\\"}
                          {eigenspace_2.data[1][0]}
                          {"&"}
                          {eigenspace_2.data[1][1]}
                          {"\\ \\end{pmatrix}\\)"}
                        </MathJax>
                      </subtitle>
                      <div
                        style={{
                          flexDirection: "row",
                          paddingLeft: "2.5px",
                          paddingRight: "5px",
                        }}
                      >
                        <TextField
                          type={"number"}
                          id="eigenvalue_2-x"
                          name="eigenvalue_2-x"
                          label="Autovector 2-x"
                          variant="filled"
                          onChange={(event) =>
                            eigenvector_2.set(0, 0, event.target.value)
                          }
                          // error={formik.touched.a && formik.errors.a}
                          // helperText={formik.touched.a && formik.errors.a}
                          valueLabelDisplay="auto"
                          disabled={isImaginary}
                        />

                        <TextField
                          type={"number"}
                          variant="filled"
                          id="eigenvalue_2-y"
                          name="eigenvalue_2-y"
                          label="Autovector 2-y"
                          onChange={(event) =>
                            eigenvector_2.set(1, 0, event.target.value)
                          }
                          // error={formik.touched.a && formik.errors.a}
                          // helperText={formik.touched.a && formik.errors.a}
                          disabled={isImaginary}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    onClick={() => check_eigenvectors()}
                    // onSubmit={formik.handleSubmit}
                    style={{ marginTop: "20px" }}
                  >
                    Confirmar Autovectores
                  </Button>
                  {renderFlag()}
                </div>
              </>
            )}
          </div>
          <div className="display">
            {flag !== 0 ? null : (
              <>
                <h2>Resultados</h2>
                <Display
                  p={p}
                  q={q}
                  url={url}
                  ev1={[eigenvector_1.get(0, 0), eigenvector_1.get(1, 0)]}
                  ev2={[eigenvector_2.get(0, 0), eigenvector_2.get(1, 0)]}
                  values = {new Array(a_value, b_value, c_value, d_value)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}
