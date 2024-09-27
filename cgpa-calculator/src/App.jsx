import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState('');
  const [sgpa, setSgpa] = useState('');
  const [conversionFormula, setConversionFormula] = useState('(sgpa - 0.5) * 10');
  const [totalMarksPerSubject, setTotalMarksPerSubject] = useState('');
  const [percentage, setPercentage] = useState(null);
  const [marksObtained, setMarksObtained] = useState(null);
  const [totalMarks, setTotalMarks] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Loading spinner state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Show loading spinner

    if (sgpa && subjects && totalMarksPerSubject && conversionFormula) {
      try {
        const formula = conversionFormula.replace(/sgpa/g, sgpa);
        const convertedPercentage = eval(formula);

        if (convertedPercentage < 0 || convertedPercentage > 100) {
          setError('The calculated percentage is out of range.');
          setLoading(false); // Hide loading spinner
          return;
        }

        setPercentage(convertedPercentage);

        const total = parseFloat(totalMarksPerSubject) * parseFloat(subjects);
        setTotalMarks(total);

        const marks = (convertedPercentage / 100) * total;
        setMarksObtained(marks);

        try {
          const response = await fetch('http://localhost:5000/api/students', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              subjects,
              sgpa,
              conversionFormula,
              percentage: convertedPercentage,
              marksObtained: marks,
              totalMarksPerSubject,
              totalMarks: total,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save data');
          }

          setSubmitted(true);
          setLoading(false); // Hide loading spinner
        } catch (error) {
          console.error(error.message);
          setLoading(false); // Hide loading spinner
        }
      } catch (error) {
        setError('Invalid conversion formula');
        setLoading(false); // Hide loading spinner
      }
    }
  };

  const resetForm = () => {
    setName('');
    setSubjects('');
    setSgpa('');
    setConversionFormula('(sgpa - 0.5) * 10');
    setTotalMarksPerSubject('');
    setPercentage(null);
    setMarksObtained(null);
    setTotalMarks(null);
    setSubmitted(false);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h2>SGPA to Percentage & Marks Calculator</h2>
        </div>
        <div className="card-body">
          {!submitted && (
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="form-group">
                <label className="font-weight-bold">Student Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="font-weight-bold">Number of Subjects:</label>
                <input
                  type="number"
                  className="form-control"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="E.g., 6 subjects"
                  required
                />
              </div>
              <div className="form-group">
                <label className="font-weight-bold">SGPA:</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={sgpa}
                  onChange={(e) => setSgpa(e.target.value)}
                  placeholder="Enter your SGPA (e.g., 8.5)"
                  required
                />
              </div>
              <div className="form-group">
                <label className="font-weight-bold">
                  Conversion Formula <i>(use "sgpa")</i>:
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={conversionFormula}
                  onChange={(e) => setConversionFormula(e.target.value)}
                  placeholder="Formula like (sgpa - 0.5) * 10"
                  required
                />
                <small className="form-text text-muted">
                  Example formula: (sgpa - 0.5) * 10
                </small>
              </div>
              <div className="form-group">
                <label className="font-weight-bold">Total Marks Per Subject:</label>
                <input
                  type="number"
                  className="form-control"
                  value={totalMarksPerSubject}
                  onChange={(e) => setTotalMarksPerSubject(e.target.value)}
                  placeholder="E.g., 100 marks per subject"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  'Calculate'
                )}
              </button>
            </form>
          )}

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          {percentage !== null && (
            <div className="mt-4">
              <div className="card bg-light shadow-sm">
                <div className="card-body">
                  <h4 className="text-center text-info mb-3">Results for {name}</h4>
                  <p><strong>Number of Subjects:</strong> {subjects}</p>
                  <p><strong>SGPA:</strong> {sgpa}</p>
                  <p><strong>Conversion Formula:</strong> {conversionFormula}</p>
                  <p><strong>Total Marks (All Subjects):</strong> {totalMarks}</p>
                  <p><strong>Converted Percentage:</strong> {percentage.toFixed(2)}%</p>
                  <p><strong>Marks Obtained:</strong> {marksObtained.toFixed(2)} out of {totalMarks}</p>
                  <button onClick={resetForm} className="btn btn-secondary btn-block">
                    Calculate for Next Semester
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
