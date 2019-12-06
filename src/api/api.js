import fetch from '@/config/fetch'

export const importCommit = data => fetch('/api/importCommit', data, 'POST');

export const qryRenewYearList = () => fetch('/api/qryRenewYearList');

export const getRenewList = data => fetch('/api/getRenewList', data, 'POST');

export const renewReport = data => fetch('/api/renewReport', data, 'POST');

export const renewReport2 = data => fetch('/api/renewReport2', data, 'POST');

export const qryHistoryQry = data => fetch('/api/qryHistoryQry', data, 'POST');

export const repeatRun = data => fetch('/api/repeatRun', data, 'POST');

export const getRenewData = () => fetch('/api/getRenewData');

export const addRenewYear = data => fetch('/api/addRenewYear' , data , 'POST');

