import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ApplicationsPage from './ApplicationsPage';
import Form from '../elements/Form';


export default function DashboardPage() {
    const { logout } = useAuth();
    const [forms, setForms] = useState<Form[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [selectedForm, setSelectedForm] = useState<Form>();
    const [creatingNewForm, setCreatingNewForm] = useState(false);

    // Load forms when the page mounts
    useEffect(() => {
        document.title = 'Dashboard - Jobs';
        loadForms();
    }, []);

    const loadForms = async () => {
        const response = await api.get('/forms');
        setForms(response.data);
    };

    const createForm = async () => {
        if (!newTitle.trim()) return;
        await api.post('/forms', { title: newTitle });
        setNewTitle('');
        await loadForms();
    };

     return (
        <div className="dashboard-layout">

            <div className="sidebar">

                
                <div className="sidebar-header">
                    <h3>Your Forms</h3>
                </div>

                
                
                <>
                    {forms.length === 0 ? (
                        <p>No forms yet.</p>
                    ) : (
                        forms.map((form) => (
                            <div key={form.id} className="form-button lower-margin-small">
                                {/* <p>Applications: {form.applicationCount}</p> */}
                                <button className={(form.id === selectedForm?.id ? "filled" : "") + " full-width"}
                                        onClick={() => {setSelectedForm(form); setCreatingNewForm(false);}}>
                                    {form.title}
                                </button>
                                {/* <p>
                                    Share link:{' '}
                                    <a href={`/apply/${form.slug}`}>
                                        {window.location.origin}/apply/{form.slug}
                                    </a>
                                </p> */}
                            </div>
                        ))
                    )}
                </>
                <div className="divider"/>
                <button className="filled sidebar-child" onClick={() => { setCreatingNewForm(true); setSelectedForm(undefined);}}>
                    Create New Form
                </button>
                <button className="full-width sidebar-child-bottom" onClick={logout}>
                    Sign Out
                </button>
            </div>

            <div className="main-content">
                <div className="header">
                    <h1>Dashboard</h1>
                </div>

                <div className="divider"/>

                { selectedForm && (<ApplicationsPage form={selectedForm}/>) }

                { creatingNewForm && (<div className="header">
                    <h2>Create Application Form</h2>
                    <input
                        type="text"
                        placeholder="Form Title (e.g. Senior Developer)"
                        className="lower-margin mid-width"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <br/>
                    <button className="lower-margin" onClick={createForm}>Create</button>
                </div>) }
                
            </div>
            
            
        </div>
    );
}