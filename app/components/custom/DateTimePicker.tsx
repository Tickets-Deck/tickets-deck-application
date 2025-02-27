import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
// import { styled } from '@mui/system';

// const StyledDateTimePicker = styled(DateTimePicker)(({ theme }) => ({
//     '& .MuiStack-root': {
//         paddingTop: '0'
//     },
//     '& .MuiInputBase-root': {
//         backgroundColor: '#e0f2fe',
//         borderRadius: '8px',
//     },
//     '& .MuiOutlinedInput-notchedOutline': {
//         borderColor: '#0284c7',
//     },
//     '&:hover .MuiOutlinedInput-notchedOutline': {
//         borderColor: '#0369a1',
//     }
// }));

type BasicDateTimePickerProps = {
    className?: string;
    defaultValue?: moment.Moment;
    onChangeFn?: (newValue: moment.Moment) => void;
    minDate?: moment.Moment | undefined
    maxDate?: moment.Moment | undefined
};

export default function BasicDateTimePicker(
    { className, defaultValue, onChangeFn, minDate, maxDate }: BasicDateTimePickerProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                    className={className}
                    label=""
                    slotProps={{
                        textField: {
                            InputLabelProps: { shrink: true, style: { display: 'none' } }, // Hides the label
                            placeholder: 'Select date and time', // Optional: Placeholder instead
                            sx: {
                                '& .MuiOutlinedInput-notchedOutline': {
                                    display: 'none', // Removes the border, but keeps the padding
                                    legend: { display: 'none' } // Removes the cutout/notch
                                }
                            }
                        }
                    }}
                    defaultValue={defaultValue}
                    onChange={(newValue) => {
                        if (!newValue) return;
                        if (minDate && newValue.isBefore(minDate)) {
                            newValue = minDate;
                        }
                        onChangeFn && onChangeFn(newValue);
                    }}
                    minDateTime={minDate}
                    maxDateTime={maxDate}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}