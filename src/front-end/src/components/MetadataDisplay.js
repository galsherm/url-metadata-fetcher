import React from 'react';
import xss from 'xss';

const MetadataDisplay = ({ metadata }) => {
    if (!metadata.length) return <p>No metadata to display.</p>;

    return (
        <div>
            {metadata.map((item, index) => (
                <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                    {item.error ? (
                        <p style={{ color: 'red' }}>Error fetching metadata for this URL: {xss(item.error)}</p>
                    ) : (
                        <>
                            <h2>{xss(item.title)}</h2>
                            <p>{xss(item.description)}</p>
                            {item.image && <img src={xss(item.image)} alt={xss(item.title)} style={{ maxWidth: '100px' }} />}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};



export default MetadataDisplay;
