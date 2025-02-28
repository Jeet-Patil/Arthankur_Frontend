import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { uploadGSTReturn, generateTaxReport, getComplianceCalendar } from '../services/api';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const TaxCompliance = () => {
    const [activeTab, setActiveTab] = useState('deadlines');
    const [gstFile, setGstFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState({ loading: false, success: false, error: null });
    const [reportType, setReportType] = useState('gst');
    const [reportData, setReportData] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [calendarLoading, setCalendarLoading] = useState(false);

    const upcomingDeadlines = [
        {
            id: 1,
            type: 'GST Filing',
            description: 'Monthly GSTR-3B return filing',
            deadline: 'March 20, 2025',
            icon: 'document'
        },
        {
            id: 2,
            type: 'TDS Return',
            description: 'Quarterly TDS return filing',
            deadline: 'March 31, 2025',
            icon: 'check'
        },
        {
            id: 3,
            type: 'Income Tax Advance Payment',
            description: 'Fourth installment of advance tax',
            deadline: 'April 15, 2025',
            icon: 'clock'
        }
    ];

    useEffect(() => {
        if (activeTab === 'calendar') {
            fetchCalendarEvents();
        }
    }, [activeTab]);

    const fetchCalendarEvents = async () => {
        try {
            setCalendarLoading(true);
            const response = await getComplianceCalendar();
            
            if (response.success) {
                // Transform the API response to calendar event format
                const events = response.data.map(event => ({
                    id: event.id,
                    title: event.title,
                    start: new Date(event.dueDate),
                    end: new Date(event.dueDate),
                    allDay: true,
                    resource: {
                        description: event.description,
                        category: event.category,
                        status: event.status
                    }
                }));
                
                setCalendarEvents(events);
            }
        } catch (error) {
            console.error('Error fetching calendar events:', error);
        } finally {
            setCalendarLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setGstFile(e.target.files[0]);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        
        if (!gstFile) {
            setUploadStatus({
                loading: false,
                success: false,
                error: 'Please select a file to upload'
            });
            return;
        }
        
        try {
            setUploadStatus({ loading: true, success: false, error: null });
            
            const formData = new FormData();
            formData.append('gstData', gstFile);
            
            const response = await uploadGSTReturn(formData);
            
            if (response.success) {
                setUploadStatus({
                    loading: false,
                    success: true,
                    error: null
                });
                setGstFile(null);
            }
        } catch (error) {
            setUploadStatus({
                loading: false,
                success: false,
                error: error.message || 'Error uploading file'
            });
        }
    };

    const handleGenerateReport = async () => {
        try {
            setReportLoading(true);
            const response = await generateTaxReport(reportType);
            
            if (response.success) {
                setReportData(response.data);
            }
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setReportLoading(false);
        }
    };

    const renderFileUploadForm = () => (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">File GST Return (GSTR-3B)</h2>
            
            <form onSubmit={handleFileUpload}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Upload GST Data File</label>
                    <div className="flex items-center">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            accept=".json,.xlsx,.csv,.pdf"
                        />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                        Supported formats: JSON, XLSX, CSV, PDF (Max: 10MB)
                    </p>
                </div>
                
                <button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 disabled:bg-gray-400"
                    disabled={!gstFile || uploadStatus.loading}
                >
                    {uploadStatus.loading ? 'Uploading...' : 'Submit GSTR-3B Return'}
                </button>
                
                {uploadStatus.error && (
                    <div className="mt-4 text-red-600 text-sm">
                        {uploadStatus.error}
                    </div>
                )}
                
                {uploadStatus.success && (
                    <div className="mt-4 text-green-600 text-sm">
                        GST return uploaded successfully! Your submission has been received.
                    </div>
                )}
            </form>
        </div>
    );

    const renderReportGenerator = () => (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Generate Tax Report</h2>
            
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Report Type</label>
                <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                >
                    <option value="gst">GST Report</option>
                    <option value="tds">TDS Report</option>
                    <option value="income-tax">Income Tax Report</option>
                </select>
            </div>
            
            <button
                onClick={handleGenerateReport}
                className="bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 disabled:bg-gray-400"
                disabled={reportLoading}
            >
                {reportLoading ? 'Generating...' : 'Generate Report'}
            </button>
            
            {reportData && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">{reportData.type} - {reportData.period}</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {reportType === 'gst' ? 'Taxable Amount' : 'Amount'}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {reportType === 'gst' ? 'GST' : (reportType === 'tds' ? 'TDS' : 'Tax')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.sections.map((section, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {section.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            ₹{section.amount || section.taxable || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            ₹{section.tax || section.tds || section.gst || 0}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        Total
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                        ₹{reportType === 'gst' 
                                            ? reportData.totalTaxable 
                                            : (reportType === 'income-tax' ? reportData.totalIncome : reportData.totalDeduction || 0)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                        ₹{reportType === 'gst' 
                                            ? reportData.totalGST 
                                            : (reportType === 'tds' ? reportData.totalDeduction : reportData.totalTax || 0)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );

    const renderComplianceCalendar = () => (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Compliance Calendar</h2>
            
            {calendarLoading ? (
                <div className="flex justify-center items-center h-80">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
                </div>
            ) : (
                <div className="h-80">
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        views={['month']}
                        eventPropGetter={(event) => {
                            const backgroundColor = 
                                event.resource?.category === 'GST' ? '#8b5cf6' : 
                                event.resource?.category === 'TDS' ? '#10b981' : 
                                '#f59e0b';
                            return { style: { backgroundColor } };
                        }}
                        tooltipAccessor={(event) => event.resource?.description}
                    />
                </div>
            )}
            
            <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#8b5cf6] mr-2"></div>
                    <span className="text-sm text-gray-600">GST</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#10b981] mr-2"></div>
                    <span className="text-sm text-gray-600">TDS</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#f59e0b] mr-2"></div>
                    <span className="text-sm text-gray-600">Income Tax</span>
                </div>
            </div>
        </div>
    );

    const quickActions = [
        {
            id: 1,
            title: 'File GST Return',
            icon: 'document',
            action: () => setActiveTab('fileGST')
        },
        {
            id: 2,
            title: 'Generate Tax Report',
            icon: 'chart',
            action: () => setActiveTab('reports')
        },
        {
            id: 3,
            title: 'View Compliance Calendar',
            icon: 'calendar',
            action: () => setActiveTab('calendar')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userType="startup" />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-semibold text-gray-800 mb-8">
                    Tax & Compliance
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        {activeTab === 'deadlines' && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-6">Upcoming Deadlines</h2>
                                <div className="space-y-4">
                                    {upcomingDeadlines.map((deadline) => (
                                        <div key={deadline.id} className="border-b pb-4 last:border-b-0">
                                            <div className="flex items-start">
                                                <div className="flex-grow">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {deadline.type}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        {deadline.description}
                                                    </p>
                                                    <p className="text-violet-600 font-medium mt-1">
                                                        {deadline.deadline}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'fileGST' && renderFileUploadForm()}
                        {activeTab === 'reports' && renderReportGenerator()}
                        {activeTab === 'calendar' && renderComplianceCalendar()}
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                            <div className="space-y-3">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.id}
                                        className="w-full bg-violet-50 hover:bg-violet-100 text-violet-700 py-3 px-4 rounded-lg text-left transition-colors duration-200"
                                        onClick={action.action}
                                    >
                                        {action.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Additional Help Section */}
                        <div className="bg-white rounded-lg shadow p-6 mt-6">
                            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
                            <p className="text-gray-600 text-sm mb-4">
                                Get expert assistance with tax compliance and filing requirements.
                            </p>
                            <button className="w-full border border-violet-600 text-violet-700 hover:bg-violet-50 py-2 px-4 rounded-md font-medium transition-colors duration-200">
                                Contact Tax Expert
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxCompliance;