import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/reports/reportsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditReports = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    report_name: '',

    kpi: '',

    value: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { reports } = useAppSelector((state) => state.reports);

  const { reportsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: reportsId }));
  }, [reportsId]);

  useEffect(() => {
    if (typeof reports === 'object') {
      setInitialValues(reports);
    }
  }, [reports]);

  useEffect(() => {
    if (typeof reports === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = reports[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [reports]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: reportsId, data }));
    await router.push('/reports/reports-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit reports')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit reports'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='ReportName'>
                <Field name='report_name' placeholder='ReportName' />
              </FormField>

              <FormField label='KPI'>
                <Field name='kpi' placeholder='KPI' />
              </FormField>

              <FormField label='Value'>
                <Field type='number' name='value' placeholder='Value' />
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/reports/reports-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditReports.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_REPORTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditReports;
