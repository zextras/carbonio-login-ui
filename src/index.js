import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import './index.css';

const H1 = styled.h1`
    color: red;
`;
render(<H1>Hello World</H1>, document.getElementById('app'));