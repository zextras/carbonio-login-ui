/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import {useCallback, useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {postV1Login} from "../../services/v1-service";

export default function useLoginView() {
    const history = useHistory();
    const location = useLocation();

    const [from, setFrom] = useState();
    useEffect(() => {
        setFrom(location.state || {from: {pathname: '/'}});
    }, [location, setFrom]);

    const usernameRef = useRef();
    const passwordRef = useRef();
    const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true');

    const returnToPage = useCallback(() => {
        history.replace(from);
    }, [history, from]);

    const doLogin = useCallback((ev) => {
        ev.preventDefault();
        return new Promise(function (resolve, reject) {
            if (rememberMe === true) {
                localStorage.setItem('username', usernameRef.current.value);
                localStorage.setItem('password', passwordRef.current.value);
            }
            postV1Login(
                "PASSWORD",
                usernameRef.current.value,
                passwordRef.current.value
            )
                .then(res => {
                    if (res.status === 401)
                        throw Error('Unauthorized');
                    if (res.status >= 500)
                        throw Error('Network Error');
                    return res;
                })
                .then(() => returnToPage())
                .catch((err) => {
                    reject(err);
                });
        });
    }, [returnToPage, usernameRef, passwordRef, rememberMe]);

    return {
        doLogin,
        usernameRef,
        passwordRef,
        rememberMe, setRememberMe,
        returnToPage
    };
}
