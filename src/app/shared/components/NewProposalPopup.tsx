/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react';
import { styled } from '@linaria/react';
import { Button, AmountInput, Popup, Rate } from '@app/shared/components';
import { IconCancel, IconCreateProposal } from '@app/shared/icons';

import { useDispatch, useSelector } from 'react-redux';
import { selectErrorMessage } from '@app/shared/store/selectors';
import { useFormik } from 'formik';
import { toGroths } from '@core/appUtils';
import { UserDeposit } from '@core/api';
import { css } from '@linaria/core';

interface NewProposalPopupProps {
  visible?: boolean;
  onCancel?: ()=>void;
}

interface NewProposalFormData {
    send_amount: string;
}

const newProposalClass = css`
    width: 760px !important;
`;

const FeeContainer = styled.div`
    margin-top: 20px;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    
    > .fee-head {
        align-self: start;

        > .title {
            font-size: 12px;
            color: rgba(255, 255, 255, .5);
        }

        > .value {
            font-weight: 500;
            font-size: 14px;
            color: #DA68F5;
            margin-left: 10px;
        }
    }

    > .fee-rate {
        align-self: start;
        font-size: 12px;
        margin-left: 31px;
    }
`;

const InfoContainer = styled.div`
    font-size: 12px;
    color: rgba(255, 255, 255, .7);
    font-style: italic;
    margin-top: 30px;
`;

const NewProposalButtonsClass = css`
    max-width: 138px !important;
`;

const NewProposalPopup: React.FC<NewProposalPopupProps> = ({ visible, onCancel }) => {
  const inputRef = useRef<HTMLInputElement>();
  const [warned, setWarned] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector(selectErrorMessage());

  const formik = useFormik<NewProposalFormData>({
    initialValues: {
      send_amount: '',
    },
    isInitialValid: false,
    //validate: (e) => validate(e, setHint),
    onSubmit: (value) => {
        UserDeposit(toGroths(parseFloat(value.send_amount)));
        onCancel();
    },
  });

  const {
    values, setFieldValue, errors, submitForm,
  } = formik;

  const handleAssetChange = (e: string) => {
    setFieldValue('send_amount', e, true);
  };

  return (
    <Popup
      className={newProposalClass}
      visible={visible}
      title="New proposal"
      cancelButton={(
        <Button className={NewProposalButtonsClass} variant="ghost" icon={IconCancel} onClick={onCancel}>
          cancel
        </Button>
      )}
      confirmButton={(
        <Button className={NewProposalButtonsClass} variant="regular"
        pallete='green' icon={IconCreateProposal} onClick={submitForm}>
          create
        </Button>
      )}
      onCancel={onCancel}
    >
        <form onSubmit={submitForm}>
            {/* <AmountInput
                value={values.send_amount}
                error={errors.send_amount?.toString()}
                onChange={(e) => handleAssetChange(e)}
            />
            <FeeContainer>
                <div className='fee-head'>
                    <span className='title'>Fee</span>
                    <span className='value'>0.0011 BEAM</span>
                </div>
                <Rate value={0.0011} className='fee-rate'/>
            </FeeContainer>
            <InfoContainer>
                <div>Depositing will increase your voting power in next epoch #16</div>
                <div>(17 Jan - 1 Feb, 22)</div>
            </InfoContainer> */}
        </form>
    </Popup>
  );
};

export default NewProposalPopup;