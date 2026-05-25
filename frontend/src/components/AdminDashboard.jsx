import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function AdminDashboard() {
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('buses'); // 'buses' or 'bookings'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states for Add/Edit Bus
  const [editingBusId, setEditingBusId] = useState(null);
  const [busForm, setBusForm] = useState({
    busName: '',
    busNumber: '',
    source: '',
    destination: '',
    travelDate: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: 12,
    fare: '',
  });

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getBuses();
      setBuses(data);
    } catch (err) {
      setError('Failed to fetch buses. Please ensure you have administrator privileges.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings. Please ensure you have administrator privileges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'buses') {
      fetchBuses();
    } else {
      fetchBookings();
    }
  }, [activeTab]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBusForm((prev) => ({
      ...prev,
      [name]: name === 'fare' || name === 'totalSeats' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const resetForm = () => {
    setBusForm({
      busName: '',
      busNumber: '',
      source: '',
      destination: '',
      travelDate: '',
      departureTime: '',
      arrivalTime: '',
      totalSeats: 12,
      fare: '',
    });
    setEditingBusId(null);
  };

  const handleEditClick = (bus) => {
    setEditingBusId(bus.id);
    setBusForm({
      busName: bus.busName || '',
      busNumber: bus.busNumber || '',
      source: bus.source || '',
      destination: bus.destination || '',
      travelDate: bus.travelDate || '',
      departureTime: bus.departureTime || '',
      arrivalTime: bus.arrivalTime || '',
      totalSeats: bus.totalSeats || 12,
      fare: bus.fare || '',
    });
    // Scroll to form
    const formElement = document.getElementById('bus-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitBus = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!busForm.busName || !busForm.busNumber || !busForm.source || !busForm.destination || !busForm.travelDate || !busForm.departureTime || !busForm.arrivalTime || !busForm.fare) {
      setError('Please fill in all fields');
      return;
    }

    if (busForm.source.toLowerCase() === busForm.destination.toLowerCase()) {
      setError('Source and destination cannot be the same');
      return;
    }

    try {
      setLoading(true);
      if (editingBusId) {
        // Update Bus
        await adminAPI.updateBus(editingBusId, busForm);
        setSuccess('Bus updated successfully!');
      } else {
        // Add Bus
        await adminAPI.addBus(busForm);
        setSuccess('Bus added successfully with its 12-seat layout!');
      }
      resetForm();
      fetchBuses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bus details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBus = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bus? All associated bookings and seats will be permanently deleted.')) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      setLoading(true);
      await adminAPI.deleteBus(id);
      setSuccess('Bus and associated data deleted successfully!');
      fetchBuses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete bus.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-shield-lock-fill text-indigo-400 me-2"></i>
            Admin Control Panel
          </h2>
          <p className="text-secondary small mb-0">Manage buses, schedules, routes, and view complete system bookings</p>
        </div>

        <div className="btn-group shadow-lg" role="group">
          <button
            type="button"
            className={`btn px-4 py-2.5 fw-bold ${activeTab === 'buses' ? 'btn-primary-glow' : 'btn-secondary-custom'}`}
            onClick={() => {
              setActiveTab('buses');
              setError('');
              setSuccess('');
            }}
          >
            <i className="bi bi-bus-front me-2"></i> Manage Buses
          </button>
          <button
            type="button"
            className={`btn px-4 py-2.5 fw-bold ${activeTab === 'bookings' ? 'btn-primary-glow' : 'btn-secondary-custom'}`}
            onClick={() => {
              setActiveTab('bookings');
              setError('');
              setSuccess('');
            }}
          >
            <i className="bi bi-ticket-detailed me-2"></i> View Bookings
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-15 text-danger small rounded-3 d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-15 text-success small rounded-3 d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>{success}</div>
        </div>
      )}

      {activeTab === 'buses' ? (
        <div className="row g-4">
          {/* Left Column: Form (Add/Edit Bus) */}
          <div className="col-lg-4" id="bus-form-section">
            <div className="glass-panel">
              <h4 className="fw-bold mb-4 text-dark">
                <i className={`bi ${editingBusId ? 'bi-pencil-square' : 'bi-plus-circle'} text-indigo-400 me-2`}></i>
                {editingBusId ? 'Edit Bus Schedule' : 'Add New Bus'}
              </h4>

              <form onSubmit={handleSubmitBus} className="row g-3">
                <div className="col-12">
                  <label className="form-label form-label-custom">Bus / Operator Name</label>
                  <input
                    type="text"
                    name="busName"
                    className="form-control form-control-custom"
                    placeholder="e.g. Orange Travels"
                    value={busForm.busName}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label form-label-custom">Bus Number</label>
                  <input
                    type="text"
                    name="busNumber"
                    className="form-control form-control-custom"
                    placeholder="e.g. OR-8899"
                    value={busForm.busNumber}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label form-label-custom">Source City</label>
                  <input
                    type="text"
                    name="source"
                    className="form-control form-control-custom"
                    placeholder="e.g. Hyderabad"
                    value={busForm.source}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label form-label-custom">Destination City</label>
                  <input
                    type="text"
                    name="destination"
                    className="form-control form-control-custom"
                    placeholder="e.g. Bangalore"
                    value={busForm.destination}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label form-label-custom">Travel Date</label>
                  <input
                    type="date"
                    name="travelDate"
                    className="form-control form-control-custom"
                    value={busForm.travelDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label form-label-custom">Departure Time</label>
                  <input
                    type="text"
                    name="departureTime"
                    className="form-control form-control-custom"
                    placeholder="e.g. 08:30 PM"
                    value={busForm.departureTime}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label form-label-custom">Arrival Time</label>
                  <input
                    type="text"
                    name="arrivalTime"
                    className="form-control form-control-custom"
                    placeholder="e.g. 06:00 AM"
                    value={busForm.arrivalTime}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label form-label-custom">Fare (₹)</label>
                  <input
                    type="number"
                    name="fare"
                    className="form-control form-control-custom"
                    placeholder="e.g. 1200"
                    value={busForm.fare}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label form-label-custom">Total Seats</label>
                  <input
                    type="number"
                    name="totalSeats"
                    className="form-control form-control-custom"
                    value={busForm.totalSeats}
                    disabled
                  />
                  <span className="text-secondary" style={{ fontSize: '0.7rem' }}>Standard 12-seat layout</span>
                </div>

                <div className="col-12 mt-4 d-flex gap-2">
                  <button type="submit" className="btn btn-primary-glow flex-grow-1 py-2 fw-bold" disabled={loading}>
                    {editingBusId ? 'Update Schedule' : 'Add Bus Route'}
                  </button>
                  {editingBusId && (
                    <button type="button" className="btn btn-secondary-custom py-2" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Buses Grid */}
          <div className="col-lg-8">
            <div className="glass-panel">
              <h4 className="fw-bold mb-4 text-dark">Existing Routes & Schedules</h4>

              {buses.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <i className="bi bi-bus-front fs-1 mb-3 d-block text-secondary opacity-30"></i>
                  <p>No bus schedules found in the database.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                    <thead>
                      <tr className="text-secondary small">
                        <th>Operator</th>
                        <th>Number</th>
                        <th>Route</th>
                        <th>Date & Departure</th>
                        <th>Fare</th>
                        <th>Seats</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buses.map((bus) => (
                        <tr key={bus.id} className="border-secondary border-opacity-10">
                          <td>
                            <strong className="text-light">{bus.busName}</strong>
                          </td>
                          <td className="text-secondary small">{bus.busNumber}</td>
                          <td>
                            <span className="text-light">{bus.source}</span>
                            <i className="bi bi-arrow-right text-indigo-400 mx-2" style={{ fontSize: '0.8rem' }}></i>
                            <span className="text-light">{bus.destination}</span>
                          </td>
                          <td>
                            <div className="text-light small">{bus.travelDate}</div>
                            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{bus.departureTime}</div>
                          </td>
                          <td className="text-light fw-bold">₹{bus.fare}</td>
                          <td className="text-secondary small">
                            {bus.availableSeats}/{bus.totalSeats}
                          </td>
                          <td className="text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="btn btn-sm btn-outline-light border-secondary border-opacity-30 rounded-pill"
                                onClick={() => handleEditClick(bus)}
                                title="Edit schedule"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger border-danger border-opacity-35 rounded-pill"
                                onClick={() => handleDeleteBus(bus.id)}
                                title="Delete bus"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Bookings Tab */
        <div className="glass-panel">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold text-dark mb-0">All System Bookings</h4>
            <button className="btn btn-sm btn-secondary-custom px-3" onClick={fetchBookings}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-ticket-detailed fs-1 mb-3 d-block text-secondary opacity-30"></i>
              <p>No bookings have been made yet in the system.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr className="text-secondary small">
                    <th>Ticket ID</th>
                    <th>Customer Name</th>
                    <th>Bus / Route</th>
                    <th>Travel Date</th>
                    <th>Seat Numbers</th>
                    <th>Total Fare</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-secondary border-opacity-10">
                      <td>
                        <code className="text-indigo-300">JET-{booking.id}</code>
                      </td>
                      <td>
                        <div>
                          <strong className="text-light">{booking.user?.name || 'Unknown User'}</strong>
                        </div>
                        <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                          {booking.user?.email || 'N/A'} | {booking.user?.phone || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="text-light fw-bold" style={{ fontSize: '0.85rem' }}>{booking.bus?.busName}</div>
                        <div className="text-secondary small">
                          {booking.bus?.source} <i className="bi bi-arrow-right text-indigo-400 mx-1"></i> {booking.bus?.destination}
                        </div>
                      </td>
                      <td className="text-light small">{booking.bus?.travelDate}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {booking.seatNumbers ? (
                            booking.seatNumbers.split(',').map((seat) => (
                              <span key={seat} className="badge bg-indigo-900 bg-opacity-65 text-indigo-300 border border-indigo-800 px-2 py-1 rounded">
                                {seat}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted small">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="text-light fw-bold">₹{booking.totalFare}</td>
                      <td>
                        {booking.status === 'CANCELLED' ? (
                          <span className="badge bg-danger bg-opacity-15 text-danger border border-danger border-opacity-25 px-2 py-1">
                            Cancelled
                          </span>
                        ) : (
                          <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25 px-2 py-1">
                            Confirmed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
