import React, { Component, useRef, useEffect } from 'react';

/* Serve per il timer di refresh*/
export const useInterval = (callback, delay) => {
	const savedCallback = useRef();
	useEffect(() => {
		savedCallback.current = callback;
	}, [ callback ]);
	useEffect(() => {
		const tick = () => {
			savedCallback.current && savedCallback.current();
		};
		if (delay) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [ delay ]);
};