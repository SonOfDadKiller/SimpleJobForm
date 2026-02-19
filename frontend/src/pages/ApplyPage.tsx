import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function ApplyPage() {
    const { slug } = useParams();
    const [formTitle, setFormTitle] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadForm();
    }, [slug]);

    useEffect(() => {
        document.title = `Apply: ${formTitle}`;
    }, [formTitle]);

    const loadForm = async () => {
        try {
            const response = await api.get(`/forms/${slug}`);
            setFormTitle(response.data.title);
        } catch {
            setError('Application form not found');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/applications/${slug}`, {
                applicantName: name,
                applicantEmail: email,
                coverLetter,
            });
            setSubmitted(true);
        } catch {
            setError('Failed to submit application');
        }
    };

    if (error) return <div className="page"><p className="error">{error}</p></div>;

    if (submitted) {
        return (
            <div className="page">
                <h1>Application Submitted!</h1>
                <p>Thank you for applying. You'll hear back soon.</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Apply: {formTitle}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Cover Letter</label>
                    <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={6}
                        required
                    />
                </div>
                <button type="submit">Submit Application</button>
            </form>
        </div>
    );
}