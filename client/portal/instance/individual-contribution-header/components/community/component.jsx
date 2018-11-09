import PropTypes from 'prop-types';
import { Grid, Row } from 'react-bootstrap';

import CommunityContent from './components/content';
import LeftRightMargin from './../../../../../react-utils/left-right-margin';
import PortalContent from './../../../../../react-utils/portal-content';

// import debug from './../../debug';
// const log = debug('client/portal/instance/individual-contribution/component-community');

const Component = (props) => {
    return (
        <Row className="warpjs-individual-contribution-community">
            <LeftRightMargin />

            <PortalContent>
                <Grid fluid>
                    <Row>
                        <CommunityContent users={props.users} />
                    </Row>
                </Grid>
            </PortalContent>

            <LeftRightMargin />
        </Row>
    );
};

Component.displayName = 'IndividualContributionCommunity';

Component.propTypes = {
    users: PropTypes.array.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
