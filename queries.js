systemconfig_sql_query=`SELECT * FROM SUB_SYSTEM_CONFIG WHERE TEAM='<team>' AND RELEASE='<release>' AND RISK_CATEGORY='<riskcategory>'`
releases_sql_query=`SELECT DISTINCT RELEASE FROM RELEASE_BRANCH ORDER BY 1 DESC`
runtypes_sql_query=`SELECT SEQNO, RUN_TYPE, RELEASE FROM ( SELECT ROWNUM SEQNO, RUN_TYPE, RELEASE FROM ( SELECT DISTINCT BUILD_LABEL, RELEASE, RUN_TYPE FROM TEST_RUN ORDER BY BUILD_LABEL DESC )) ORDER BY SEQNO ASC`
buildlabels_sql_query=`SELECT DISTINCT BUILD_LABEL, RELEASE FROM TEST_RUN ORDER BY BUILD_LABEL DESC`
teams_sql_query=`SELECT DISTINCT TEAM FROM TEST_RUN ORDER BY 1 ASC`
riskcategories_sql_query=`SELECT DISTINCT RISK_CATEGORY FROM TEST_RUN ORDER BY 1 ASC`
runtypesForRelease_sql_query=`SELECT DISTINCT RUN_TYPE FROM TEST_RUN WHERE RELEASE='<release>' ORDER BY 1 DESC`
allsystemconfig_sql_query=`SELECT * FROM SUB_SYSTEM_CONFIG`
regression_report_data_sql_query=`SELECT * FROM REGRESSION_REPORT_DATA`
config_tool_release_mappings_sql_query=`SELECT * FROM CONFIG_TOOL_RELEASE_MAPPINGS`

runtype_regression_report_sql_query=`select
baseline.run_type baseline_runtype,
iteration3.run_type,iteration3.run_key,iteration3.team,iteration3.risk_category,iteration3.release,iteration3.status,iteration3.test_status,iteration3.test_case_logical_name,iteration3.test_case_name,iteration3.test_unit,iteration3.test_path
from
(
select
run_type,run_key,team,risk_category,release,status,test_status,test_case_logical_name,test_case_name,test_unit,test_path
from test_run, test_results
where test_run.test_run_id=test_results.test_run_id
and test_run.run_type='<currentRunType>'
and status = 'COMPLETED'
and release='<release>'
and run_iteration=3
and test_status in ('FAILURE','SKIP')
) iteration3,
(
select
run_type,run_key,team,risk_category,release,status,test_status,test_case_logical_name,test_case_name,test_unit,test_path
from test_run, test_results
where test_run.test_run_id=test_results.test_run_id
and test_run.run_type='<currentRunType>'
and status = 'COMPLETED'
and release='<release>'
and run_iteration=2
and test_status in ('FAILURE','SKIP')
) iteration2,
(
select
run_type,run_key,team,risk_category,release,status,test_status,test_case_logical_name,test_case_name,test_unit,test_path
from test_run, test_results
where test_run.test_run_id=test_results.test_run_id
and test_run.run_type='<currentRunType>'
and status = 'COMPLETED'
and release='<release>'
and run_iteration=1
and test_status in ('FAILURE','SKIP')
) iteration1,
(
select
run_type,run_key,team,risk_category,release,status,test_status,test_case_logical_name,test_case_name,test_unit,test_path
from test_run, test_results
where test_run.test_run_id=test_results.test_run_id
and test_run.run_type='<previousRunType>'
and release='<release>'
and status = 'COMPLETED'
and run_iteration=1
and test_status='SUCCESS'
UNION ALL
select
run_type,run_key,team,risk_category,release,status,test_status,test_case_logical_name,test_case_name,test_unit,test_path
from test_run, test_results
where test_run.test_run_id=test_results.test_run_id
and test_run.run_type='<previousRunType>'
and release='<release>'
and status = 'COMPLETED'
and run_iteration=2
and test_status='SUCCESS'
UNION ALL
select
run_type,run_key,team,risk_category,release,status,test_status,test_case_logical_name,test_case_name,test_unit,test_path
from test_run, test_results
where test_run.test_run_id=test_results.test_run_id
and test_run.run_type='<previousRunType>'
and release='<release>'
and status = 'COMPLETED'
and run_iteration=3
and test_status='SUCCESS'
) baseline
where iteration1.run_key=iteration2.run_key
and iteration1.team=iteration2.team
and iteration1.risk_category=iteration2.risk_category
and iteration1.release=iteration2.release
and iteration1.test_case_logical_name=iteration2.test_case_logical_name
and iteration1.test_case_name=iteration2.test_case_name
and iteration1.test_path=iteration2.test_path
and iteration1.test_unit=iteration2.test_unit
and iteration2.run_key=iteration3.run_key
and iteration2.team=iteration3.team
and iteration2.risk_category=iteration3.risk_category
and iteration2.release=iteration3.release
and iteration2.test_case_logical_name=iteration3.test_case_logical_name
and iteration2.test_case_name=iteration3.test_case_name
and iteration2.test_path=iteration3.test_path
and iteration2.test_unit=iteration3.test_unit
and baseline.run_key=iteration1.run_key
and baseline.team=iteration1.team
and baseline.risk_category=iteration1.risk_category
and baseline.release=iteration1.release
and baseline.test_case_logical_name=iteration1.test_case_logical_name
and baseline.test_case_name=iteration1.test_case_name
and baseline.test_path=iteration1.test_path
and baseline.test_unit=iteration1.test_unit
order by iteration3.team,iteration3.run_key,iteration3.risk_category
`

