import { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import Application from '../elements/Application';

export function useApplicationHub(formId: string | null, token: string | null)
{
    const [applications, setApplications] = useState<Application[]>([]);
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const tokenRef = useRef(token);

    useEffect(() => {
        tokenRef.current = token;
    }, [token]);

    useEffect(() => {
        console.log('Effect running, formId:', formId);

        if (!formId || !token) return;

        let cancelled = false;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl('/hubs/applications', {
                accessTokenFactory: () => token,
                transport: signalR.HttpTransportType.WebSockets,
                skipNegotiation: true,
            })
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;

        // Listen for applications
        connection.on('NewApplication', (application: Application) => {
            if (!cancelled){
                // Append new application to the list
                setApplications(prev => [...prev, application]);
            }
        });

        connection.onreconnected(() => {
            if (!cancelled){
                connection.invoke('WatchForm', formId).catch(console.error);
            }
        })

        // Start connection and join the form's group
        connection.start()
            .then(() => {
                if (!cancelled) {
                    connection.invoke('WatchForm', formId);
                }
            })
            .catch(err => {
                if (!cancelled) {
                    console.error('SignalR error:', err);
                }
            });

        // Cleanup on unmount or when formId changes
        return () => {
            console.log('Cleanup running, formId:', formId);
            cancelled = true;
            connection.stop();
        };
    }, [formId, token]);

    return { applications, setApplications };
}