import React, { Component } from 'react'
import { ServerError } from '../Auth'
import * as Sentry from '@sentry/browser';
import { DSN } from '../../config';
import { connect } from 'react-redux'
import { SERVER_ERROR } from '../../actions/types';

class ErrorBoundary extends Component {

    constructor(props) {
        super(props);
        Sentry.init({ dsn: DSN });
        this.state = { error: null, eventId: null };
    }

    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            const eventId = Sentry.captureException(error);
            this.setState({ eventId });
        });
        this.setState({ error: true });
        this.props.dispatch({ type: SERVER_ERROR, payload: true })
    };

    render() {
        if (this.props.serverError) {
            return <ServerError />
        }
        return this.props.children
    };
}

function mapStateToProps({ alertError: { serverError } }) {
    return {
        serverError
    }
}

export default connect(mapStateToProps)(ErrorBoundary)

