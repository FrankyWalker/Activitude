import React, { useState, useEffect } from 'react';
import { RefreshCw, Server, Clock, Tag, Activity, Database, AlertCircle } from 'lucide-react';

const DockerStatus = () => {
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const API_ENDPOINT = 'http://146.190.127.237:4000/docker/status';

    const styles = {
        container: {
            minHeight: '100vh',
            padding: '2rem',
            backgroundColor: '#050a18',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
        },
        innerContainer: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
        },
        title: {
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
        },
        titleIcon: {
            marginRight: '0.5rem',
        },
        controls: {
            display: 'flex',
            alignItems: 'center',
        },
        refreshButton: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1d4ed8',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
        refreshButtonHover: {
            backgroundColor: '#2563eb',
        },
        refreshIcon: {
            marginRight: '0.5rem',
        },
        timestamp: {
            marginLeft: '1rem',
            color: '#9ca3af',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
        },
        timestampIcon: {
            marginRight: '0.25rem',
        },
        errorContainer: {
            backgroundColor: '#7f1d1d',
            color: '#fee2e2',
            padding: '1rem',
            borderRadius: '0.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
        },
        errorIcon: {
            marginRight: '0.5rem',
        },
        stats: {
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        statsText: {
            fontSize: '1.125rem',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
        },
        card: {
            backgroundColor: '#111827',
            borderRadius: '0.375rem',
            overflow: 'hidden',
            transition: 'all 0.2s',
            borderWidth: '1px',
            borderStyle: 'solid',
        },
        cardHeader: {
            padding: '1rem',
            borderBottom: '1px solid #1f2937',
        },
        cardHeaderContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        cardTitle: {
            fontSize: '1.125rem',
            fontWeight: '500',
            color: '#ffffff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        cardBody: {
            padding: '1rem',
        },
        cardRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
        },
        cardLabel: {
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
        },
        cardValue: {
            color: '#e5e7eb',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
        },
        cardValueTruncate: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '200px',
        },
        statusBadge: {
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
        },
        statusUp: {
            color: '#4ade80',
        },
        statusDown: {
            color: '#f87171',
        },
        statusUnknown: {
            color: '#fbbf24',
        },
        emptyState: {
            gridColumn: '1 / -1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem',
            backgroundColor: '#111827',
            borderRadius: '0.375rem',
            border: '1px solid #1f2937',
        },
        emptyStateContent: {
            color: '#9ca3af',
            textAlign: 'center',
        },
        emptyStateIcon: {
            margin: '0 auto',
            marginBottom: '1rem',
            opacity: '0.5',
        },
        spinner: {
            animation: 'spin 1s linear infinite',
            marginLeft: '1rem',
            color: '#9ca3af',
        },
    };

    const fetchDockerStatus = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) {
                throw new Error(`Failed to fetch docker status: ${response.statusText}`);
            }
            const data = await response.json();
            setContainers(data.all_containers);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDockerStatus();
        const interval = setInterval(fetchDockerStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (timeString) => {
        if (!timeString) return 'Unknown';
        return timeString;
    };

    const getStatusColor = (status) => {
        if (status && status.toLowerCase().includes('up')) {
            return styles.statusUp;
        } else if (status && status.toLowerCase().includes('exited')) {
            return styles.statusDown;
        }
        return styles.statusUnknown;
    };

    return (
        <div style={styles.container}>
            <div style={styles.innerContainer}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        <Server style={styles.titleIcon} /> Docker Process Status
                        {loading && <RefreshCw style={{...styles.spinner, marginLeft: '1rem'}} size={20} />}
                    </h1>

                    <div style={styles.controls}>
                        <button
                            onClick={fetchDockerStatus}
                            style={styles.refreshButton}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.refreshButtonHover.backgroundColor}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.refreshButton.backgroundColor}
                        >
                            <RefreshCw size={16} style={styles.refreshIcon} /> Refresh
                        </button>
                        <div style={styles.timestamp}>
                            <Clock size={14} style={styles.timestampIcon} />
                            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                        </div>
                    </div>
                </div>

                {error && (
                    <div style={styles.errorContainer}>
                        <AlertCircle style={styles.errorIcon} />
                        Error connecting to {API_ENDPOINT}: {error}
                    </div>
                )}

                <div style={styles.stats}>
                    <div>
                        <span style={styles.statsText}>Total containers: {containers.length}</span>
                    </div>
                </div>

                <div style={styles.grid}>
                    {containers.map((container) => (
                        <div
                            key={container.id}
                            style={{
                                ...styles.card,
                                borderColor: container.name.startsWith('rust-workspace-') ? '#ff4500' : '#ff8c00'
                            }}
                        >
                            <div style={styles.cardHeader}>
                                <div style={styles.cardHeaderContent}>
                                    <h3 style={styles.cardTitle} title={container.name}>
                                        {container.name}
                                    </h3>
                                    <span style={{...styles.statusBadge, ...getStatusColor(container.status)}}>
                    {container.status && container.status.split(' ')[0]}
                  </span>
                                </div>
                            </div>

                            <div style={styles.cardBody}>
                                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>
                    <Database size={16} style={{marginRight: '0.5rem'}} /> Container ID
                  </span>
                                    <span style={styles.cardValue}>
                    {container.id.substring(0, 12)}
                  </span>
                                </div>

                                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>
                    <Tag size={16} style={{marginRight: '0.5rem'}} /> Image
                  </span>
                                    <span style={{...styles.cardValue, ...styles.cardValueTruncate}} title={container.image}>
                    {container.image}
                  </span>
                                </div>

                                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>
                    <Activity size={16} style={{marginRight: '0.5rem'}} /> Status
                  </span>
                                    <span style={{...styles.cardValue, ...getStatusColor(container.status)}}>
                    {formatTime(container.status)}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {containers.length === 0 && !loading && (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyStateContent}>
                                <Database size={48} style={styles.emptyStateIcon} />
                                <p>No containers found</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DockerStatus;