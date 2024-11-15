"use client";

import React, { useState, useEffect } from 'react';

export default function PhilippinesClock() {
  const [dateTime, setDateTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setDateTime(now.toLocaleString('en-US', options));
    };

    updateTime(); // Set initial time
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  if (dateTime === null) {
    return null; // or return a loading placeholder
  }

  return (
    <div className="text-center py-2 bg-base-200">
      <p className="text-lg font-semibold">{dateTime}</p>
    </div>
  );
}