import { React } from 'react';
import { useState, useEffect } from 'react';

export function Config() {
    // Configurações gerais do aplicativo
    return {
        apiBaseUrl: 'https://api.example.com',
        appName: 'Mantran Web',
        version: '1.0.0',
        supportEmail: 'support@example.com',
        secretKey: 'secrete-key-test'
    };
}
