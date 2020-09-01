import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import './index.css';

const Test = styled.h1`
    transform: translateX(50px);
`;
render(<Test>Hello World</Test>, document.getElementById('app'));