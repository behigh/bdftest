import * as React from 'react'
import PropTypes from 'prop-types'
import {Spinner} from 'react-bootstrap'

const Loading = props => {
    return  (
        <div className="flex-fill d-flex align-items-center justify-content-center">
            <Spinner {...props} />
        </div>
    )
}

Loading.propTypes = {
    animation: PropTypes.oneOf(['border', 'grow']),
    size: PropTypes.oneOf(['sm', 'lg']),
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'])
}

Loading.defaultProps = {
    animation: 'border',
    variant: 'secondary',
}

export default Loading
