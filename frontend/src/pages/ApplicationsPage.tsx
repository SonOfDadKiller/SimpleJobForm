import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { useApplicationHub } from '../hooks/useApplicationHub';
import Form from '../elements/Form';
import api from '../api/client';
import Application from '../elements/Application';
import { CopyToClipboardButton } from '../widgets/CopyToClipboardButton';

export default function ApplicationsPage({ form }: { form: Form }) {

    const { token } = useAuth();
    const { applications, setApplications } = useApplicationHub(form.id, token);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [selectedEmailGroup, setSelectedEmailGroup] = useState('');
    const [draggedApp, setDraggedApp] = useState<Application | null>(null);
    const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);

    const statuses = ['New', 'Reviewed', 'Shortlisted', 'Rejected'];

    useEffect(() => {
        loadApplications();
    }, [form.id]);

    const loadApplications = async () => {
        const response = await api.get(`/applications/form/${form.id}`);
        setApplications(response.data);
    }

    const getFormLink = (form: Form) => {
        return `${window.location.origin}/apply/${form.slug}`;
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    const updateStatus = async (applicationId: string, status: string) => {
        await api.patch(`/applications/${applicationId}/status`, { status });
        
        setApplications(prev =>
            prev.map(app =>
                app.id === applicationId ? { ...app, status } : app
            )
        );

        setSelectedApplication(prev => 
            prev ? { ...prev, status } : null
        );
    };

    const applicationsByStatus = statuses.reduce((groups, status) => {
        groups[status] = applications.filter(app => app.status === status);
        return groups;
    }, {} as Record<string, Application[]>);

    const getEmails = (status: string) => {
        let sectionApplications = applicationsByStatus[status];
        const emails = sectionApplications.map(app => app.applicantEmail).join(',');
        return emails;
    }

    const applicationSection = (status: string) => {
        let sectionApplications = applicationsByStatus[status];

        return (
            <div
                key={status}
                className={`status-section
                    ${draggedApp && draggedApp.status !== status ? 'drop-target' : ''} 
                    ${draggedApp && draggedApp.status !== status && dragOverStatus === status ? 'drop-hover' : ''}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverStatus(status);
                }}
                onDrop={() => {
                    if (draggedApp && draggedApp.status !== status) {
                        updateStatus(draggedApp.id, status);
                        setDraggedApp(null);
                        setDragOverStatus(null);
                    }
                }}
            >
                <div className="row-between">
                    <h3 className="status-title">{status} ( {sectionApplications.length.toString()} )</h3>
                    { sectionApplications.length > 0 ? (<button onClick={() => {
                        setSelectedEmailGroup(status);
                        console.log("clicked copy email");
                    }}>Email All</button>) : (<></>)}
                </div>
                <div className="divider"/>
                <div className="card-grid">
                    {sectionApplications.map(application => (
                        <div 
                            className={`card ${draggedApp?.id === application.id ? 'card-dragging' : ''}`}
                            key={application.id} 
                            draggable
                            onDragStart={() => {
                                setDraggedApp(application);
                            }}
                            onDragEnd={() => setDraggedApp(null)}
                            onClick={() => setSelectedApplication(application)}
                        >
                            <h3>{application.applicantName}</h3>
                            <p>Email: {application.applicantEmail}</p>
                            <p>Status: {application.status}</p>
                            <p>Submitted: {formatDate(application.submittedAt.toString())}</p>
                            <p className="card-text-preview">{application.coverLetter}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="sidebar-header">
                <h2 className="right-margin">{ form.title }</h2>
                <button className="right-margin-small" onClick={() => window.open(getFormLink(form), '_blank')}>
                    View Form
                </button>
                <CopyToClipboardButton text={getFormLink(form)} copiedMessage='Form Copied!'>
                    Copy Link to Form
                </CopyToClipboardButton>
            </div>

            {applications.length == 0 ? (
                <p>No applications received. Send out a link to start receiving applications.</p>) : 
            <></>}
            <div className="row flex-1 stretch">
                {statuses.map(status => {
                    return applicationSection(status);
                })}
            </div>

            {/* Modals */}
            {selectedApplication && (
                <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedApplication.applicantName}</h2>
                        <p>{selectedApplication.applicantEmail}</p>
                        <div className="divider"/>
                        <p>Received - {formatDate(selectedApplication.submittedAt.toString())}</p>
                        <div className="bordered lower-margin">
                            <p className="cover-letter">{selectedApplication.coverLetter}</p>
                        </div>
                        <select
                            className="lower-margin"
                            value={selectedApplication.status}
                            onChange={(e) => updateStatus(selectedApplication.id, e.target.value)}
                        >
                            <option value="New">New</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <div className="modal-footer">
                            <button className="filled" onClick={() => setSelectedApplication(null)}>Save & Close</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedEmailGroup && (
                <div className="modal-overlay" onClick={() => setSelectedEmailGroup('')}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>'{selectedEmailGroup}' Applicant Emails</h2>
                        <div className="divider"/>
                        <p>Paste this into the 'To' field when sending an email to message everyone in the '{selectedEmailGroup}' section.</p>
                        <div className="bordered lower-margin">
                            <p>{getEmails(selectedEmailGroup)}</p>
                        </div>
                        <CopyToClipboardButton text={getEmails(selectedEmailGroup)} copiedMessage='Copied!'>
                            Copy
                        </CopyToClipboardButton>
                        <div className="modal-footer">
                            <button className="filled" onClick={() => setSelectedEmailGroup('')}>Back</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}