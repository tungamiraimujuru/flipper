/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 * @flow strict-local
 */

import {Button, FlexColumn, Input, Sheet, styled, Glyph, colors} from 'flipper';
import {replaceRequiredParametersWithValues} from '../util/uri';
import {useRequiredParameterFormValidator} from '../hooks/requiredParameters';

import type {URI} from '../flow-types';

type Props = {|
  uri: string,
  requiredParameters: Array<string>,
  shouldShow: boolean,
  onHide: ?() => void,
  onSubmit: URI => void,
|};

const Container = styled(FlexColumn)({
  padding: 10,
  width: 600,
});

const Title = styled('span')({
  display: 'flex',
  marginTop: 8,
  marginLeft: 2,
  marginBottom: 8,
});

const Text = styled('span')({
  lineHeight: 1.3,
});

const URIContainer = styled('div')({
  lineHeight: 1.3,
  marginLeft: 2,
  marginBottom: 8,
  overflowWrap: 'break-word',
});

const ButtonContainer = styled('div')({
  marginLeft: 'auto',
});

const RequiredParameterInput = styled(Input)({
  margin: 0,
  marginBottom: 10,
  height: 30,
});

const WarningIconContainer = styled('span')({
  marginRight: 8,
});

export default (props: Props) => {
  const {shouldShow, onHide, onSubmit, uri, requiredParameters} = props;
  const [isValid, values, setValuesArray] = useRequiredParameterFormValidator(
    requiredParameters,
  );
  if (uri == null || !shouldShow) {
    return null;
  } else {
    return (
      <Sheet onHideSheet={onHide}>
        {hide => {
          return (
            <Container>
              <Title>
                <WarningIconContainer>
                  <Glyph
                    name="caution-triangle"
                    size={16}
                    variant="filled"
                    color={colors.yellow}
                  />
                </WarningIconContainer>
                <Text>
                  This uri has required parameters denoted by {'{parameter}'}.
                  Numeric fields are spcified with a '#' symbol. Please fix the
                  errors to navigate to the specified uri.
                </Text>
              </Title>
              {requiredParameters.map((paramater, idx) => (
                <RequiredParameterInput
                  key={idx}
                  onChange={event =>
                    setValuesArray([
                      ...values.slice(0, idx),
                      event.target.value,
                      ...values.slice(idx + 1),
                    ])
                  }
                  placeholder={paramater}
                />
              ))}
              <URIContainer>{uri}</URIContainer>
              <ButtonContainer>
                <Button
                  onClick={() => {
                    if (onHide != null) {
                      onHide();
                    }
                    setValuesArray([]);
                    hide();
                  }}
                  compact
                  padded>
                  Cancel
                </Button>
                <Button
                  type={isValid ? 'primary' : null}
                  onClick={() => {
                    onSubmit(replaceRequiredParametersWithValues(uri, values));
                    if (onHide != null) {
                      onHide();
                    }
                    setValuesArray([]);
                    hide();
                  }}
                  disabled={!isValid}
                  compact
                  padded>
                  Submit
                </Button>
              </ButtonContainer>
            </Container>
          );
        }}
      </Sheet>
    );
  }
};