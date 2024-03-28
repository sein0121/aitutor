/*-----------------------------------------*
 * API 정의
 *-----------------------------------------*/
var API = {
    test: {
        _base: '/test',
    },
    login: {
        _base: '',
    },
    hist: {
        _base: '/aitutor/api/v1/history',
    },
    student:{
        _base:'/aitutor/api/v1/student',
        _test:'/aitutor/api/v1/student/test',
        _user:'/aitutor/api/v1/student/user',
        _result:'/aitutor/api/v1/student/result'
    },
    tutor:{
        _class:'/aitutor/api/v1/tutor/class',
        _student:'/aitutor/api/v1/tutor/student'
    },
    admin:{
        _base:'/aitutor/api/v1/admin',
        _class:'/aitutor/api/v1/admin/class',
        _student:'/aitutor/api/v1/admin/student'
    },
    agilesoda:{
        _base:'/aitutor/api/v1/agilesoda'
    },
    image: {
        _base: '/front/image',
    }
};

/*-----------------------------------------*
 * REAL API START
 *-----------------------------------------*/

// [Aitutor] login START ----------------------------/
// [LOG-01] 등록된 기관 조회 API
API.login.login = function(options, cb) {
    console.log("[LOG-01] 등록된 기관 조회 API");
    apiAjaxGet({url: `${this._base}/org-list`}, cb);
}
// [Aitutor] login END ----------------------------/

// [학생_테스트] S_TEST START ----------------------------/
// [ST-TEST-01] 테스트 문항 리스트 조회 API
API.student.list = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;
    let user_grd = data.user_grd;
    let user_test_grd = data.user_test_grd;
    let user_test_level = data.user_test_level;

    apiAjaxGet({url: `${this._test}/qst-list?org_id=${org_id}&user_id=${user_id}&user_grd=${user_grd}&user_test_grd=${user_test_grd}&user_test_level=${user_test_level}`}, cb);
}

// [ST-TEST-02] 테스트 중지 API
API.student.pause = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._test}/qst-pause`}, data, cb);
}

// [ST-TEST-03] 테스트 답변 저장 API
API.student.save = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._test}/qst-save`}, data, cb);
}

// [ST-TEST-04] 테스트 완료 후 답안지 제출 API
API.student.submission = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._test}/qst-submission`}, data, cb);
}

// [HIST-01] 테스트 문항 진입 로그 생성 API
API.hist.in = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;
    let user_grd = data.user_grd;
    let user_test_grd = data.user_test_grd;
    let user_test_level = data.user_test_level;
    let qst_id = data.qst_id;

    apiAjaxGet({url: `${this._base}/qst-in?org_id=${org_id}&user_id=${user_id}&user_grd=${user_grd}&user_test_grd=${user_test_grd}&user_test_level=${user_test_level}&qst_id=${qst_id}`}, cb);
}

// [HIST-02] 테스트 문항 진입 로그 업데이트 API (out_date update)
API.hist.out = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;
    let user_grd = data.user_grd;
    let user_test_grd = data.user_test_grd;
    let user_test_level = data.user_test_level;
    let qst_id = data.qst_id;

    apiAjaxGet({url: `${this._base}/qst-out?org_id=${org_id}&user_id=${user_id}&user_grd=${user_grd}&user_test_grd=${user_test_grd}&user_test_level=${user_test_level}&qst_id=${qst_id}`}, cb);
}
// [학생_테스트] S_TEST END - ----------------------------/

// [선생님_클래스 목록] T_LIST_CLASS START ----------------/
// [TU-CL-01] 교사 클래스 목록 페이지 진입
API.tutor.classList = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;

    apiAjaxGet({url: `${this._class}/list?org_id=${org_id}&user_id=${user_id}`}, cb);
}

// [TU-CL-02] 교사 클래스 검색
API.tutor.classSearch = function(options, cb) {
    let {data} = options || {};
    console.log(data);

    let org_id = data.org_id;
    let user_id = data.user_id;
    let search_type = data.search_type;
    let search_nm = data.search_nm;

    apiAjaxGet({url: `${this._class}/search?org_id=${org_id}&user_id=${user_id}&search_type=${search_type}&search_nm=${search_nm}`}, cb);
}

// [TU-CL-03] 교사 클래스 등록 - 이름 중복 확인
API.tutor.classname = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._class}/validate-classname`}, data, cb);
}

// [TU-CL-04] 교사 클래스 등록
API.tutor.classInsert = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._class}/insert`}, data, cb);
}

// [TU-CL-05] 교사 클래스 삭제 - 비밀번호 확인
API.tutor.password = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._class}/validate-password`}, data, cb);
}

// [TU-CL-06] 교사 클래스 삭제
API.tutor.classDelete = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._class}/delete`}, data, cb);
}

// T_LIST_CLASS END ------------------------/

// [선생님_학생 목록] T_LIST_STUDENT START ----------------------/
// [TU-ST-01] 교사 학생 목록 페이지 진입
API.tutor.studentList = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;

    apiAjaxGet({url: `${this._student}/list?org_id=${org_id}&user_id=${user_id}`}, cb);
}

// [TU-ST-02] 교사 학생 목록 학생 검색
API.tutor.studentSearch = function(options, cb) {
    let {data} = options || {};

    let org_id = data.org_id;
    let user_id = data.user_id;
    let search_type = data.search_type;
    let search_nm = data.search_nm;

    apiAjaxGet({url: `${this._student}/search?org_id=${org_id}&user_id=${user_id}&search_type=${search_type}&search_nm=${search_nm}`}, cb);
}

// [TU-ST-03] 교사 학생 목록 클래스정보 조회
API.tutor.classInfo = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;

    apiAjaxGet({url: `${this._student}/class-info?org_id=${org_id}&user_id=${user_id}`}, cb);
}

// [TU-ST-04] 교사 학생 목록 아이디 자동 생성
API.tutor.auto = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;
    let class_id = data.class_id;

    apiAjaxGet({url: `${this._student}/auto-make?org_id=${org_id}&user_id=${user_id}&class_id=${class_id}`}, cb);
}

// [TU-ST-05] 학생 이름 중복 확인 API
API.tutor.overlap = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._student}/overlap-studentname`}, data, cb);
}

// [TU-ST-06] 교사 학생 목록 학생 삭제
API.tutor.studentDelete = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._student}/delete`}, data, cb);
}

// [ST-USER-03] 사용자 회원가입 API
API.student.signUp = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._user}/sign-up`}, data, cb);
}

// T_LIST_STUDENT END ------------------------/

// [관리자_클래스 목록] ADMIN_LIST_CLASS START ----------------/
// [AD-CL-01] 관리자 클래스 목록 페이지 진입
API.admin.classList = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;

    apiAjaxGet({url: `${this._base}/class-list?org_id=${org_id}&user_id=${user_id}`}, cb);
}

// [AD-CL-02] 관리자 클래스 검색
API.admin.classSearch = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;
    let search_type = data.search_type;
    let search_nm = data.search_nm;

    apiAjaxGet({url: `${this._base}/class-search?org_id=${org_id}&user_id=${user_id}&search_type=${search_type}&search_nm=${search_nm}`}, cb);
}

// [AD-CL-03] 관리자 클래스 등록 - 이름 중복 확인
API.admin.className = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._base}/validate-classname`}, data, cb);
}

// [AD-CL-04] 관리자 클래스 등록
API.admin.classInsert = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._base}/class-insert`}, data, cb);
}

// [AD-CL-05] 관리자 클래스 삭제 - 비밀번호 확인
API.admin.password = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._base}/validate-password`}, data, cb);
}

// [AD-CL-06] 관리자 클래스 삭제
API.admin.classDelete = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._base}/class-delete`}, data, cb);
}

// ADMIN_LIST_CLASS END ------------------------/

// [관리자_학생 목록] ADMIN_LIST_STUDENT START ----------------------/
// [AD-ST-01] 관리자 학생 목록 페이지 진입
API.admin.studentList = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;

    apiAjaxGet({url: `${this._base}/student-list?org_id=${org_id}&user_id=${user_id}`}, cb);
}

// [AD-ST-06] 관리자 학생 목록 학생 검색
API.admin.studentSearch = function(options, cb) {
    let {data} = options || {};

    let org_id = data.org_id;
    let user_id = data.user_id;
    let search_type = data.search_type;
    let search_nm = data.search_nm;

    apiAjaxGet({url: `${this._base}/student-search?org_id=${org_id}&user_id=${user_id}&search_type=${search_type}&search_nm=${search_nm}`}, cb);
}

// [AD-ST-02] 관리자 학생 목록 클래스정보 조회
API.admin.classInfo = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;

    apiAjaxGet({url: `${this._base}/student-class-info?org_id=${org_id}&user_id=${user_id}`}, cb);
}

// [AD-ST-03] 관리자 학생 목록 아이디 자동 생성
API.admin.auto = function(options, cb) {
    let {data} = options || {};
    let org_id = data.org_id;
    let user_id = data.user_id;
    let class_id = data.class_id;

    apiAjaxGet({url: `${this._base}/student-auto-make?org_id=${org_id}&user_id=${user_id}&class_id=${class_id}`}, cb);
}

// [AD-ST-04] 관리자(기관) 학생 이름 중복 확인 API
API.admin.overlap = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._base}/student-overlap-studentname`}, data, cb);
}

// [AD-ST-05] 관리자 학생 목록 학생 삭제
API.admin.studentDelete = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._base}/student-delete`}, data, cb);
}

// [ST-USER-03] 사용자 회원가입 API

// ADMIN_LIST_STUDENT END ------------------------/

// [관리자(애자일소다)] ADMIN START ----------------------------/
// [AD-02] 관리자(애자일소다) 계정관리 페이지 데이터 조회 API
API.agilesoda.list = function(options, cb) {
    let {data} = options || {};
    let user_id = data.user_id;

    apiAjaxGet({url: `${this._base}/group-list?user_id=${user_id}`}, cb);
}

// [AD-03] 관리자(애자일소다) 기관 명 업데이트 API
API.agilesoda.update = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._base}/org-update`}, data, cb);
}

// [AD-04] 관리자(애자일소다) 비밀번호 저장 API
API.admin.changePass = function(options, cb) {
    let {data} = options || {};

    apiAjaxPost({url: `${this._base}/change-pass-list`}, data, cb);
}

// [관리자(애자일소다)] ADMIN END - ----------------------------/

// [학생_마이페이지] S_mypage START ----------------------------/
// [ST-USER-01] 마이페이지 정보 조회 API
API.student.smypage = function(options, cb) {
    let {data} = options || {};

    console.log("[ST-USER-01] 마이페이지 정보 조회 API",data);

    let org_id = data.org_id;
    let user_id = data.user_id;
    let user_grd = data.user_grd;
    let user_test_grd = data.user_test_grd;

    apiAjaxGet({url: `${this._user}/mypage?org_id=${org_id}&user_id=${user_id}&user_grd=${user_grd}&user_test_grd=${user_test_grd}`}, cb);
}

// [ST-USER-02] 사용자 비밀번호 변경 API
API.student.sSave = function(options, cb) {
    let {data} = options || {};

    console.log("[ST-USER-02] 사용자 비밀번호 변경 API",data);

    apiAjaxPost({url: `${this._user}/change-pass`}, data,cb);
}
// [학생_마이페이지] S_mypage END ----------------------------/

// [학생_결과] S_result START ----------------------------/
// [ST-RE-01] 학생 테스트 결과 페이지 진입
API.student.sresult = function(options, cb) {
    let {data} = options || {};

    console.log("[ST-RE-01] 학생 테스트 결과 페이지 진입",data);

    let org_id = data.org_id;
    let user_id = data.user_id;
    let user_grd = data.user_grd;
    let user_test_grd = data.user_test_grd;

    apiAjaxGet({url: `${this._result}/list?org_id=${org_id}&user_id=${user_id}&user_grd=${user_grd}&user_test_grd=${user_test_grd}`}, cb);
}
// [학생_결과] S_result END ----------------------------/

// [그래프 가져오기] drawGraph START ----------------------------/
// [ST-RE-02] 학생 테스트 결과 그래프 보기
API.student.graph = function(options, cb) {
    let {data} = options || {};

    console.log("[ST-RE-02] 학생 테스트 결과 그래프 보기",data);

    let org_id = data.org_id;
    let user_id = data.user_id;
    let user_grd = data.user_grd;
    let user_test_grd = data.user_test_grd;

    apiAjaxGet({url: `${this._result}/final-path?org_id=${org_id}&user_id=${user_id}&user_grd=${user_grd}&user_test_grd=${user_test_grd}`}, cb);
}
// [그래프 가져오기] drawGraph END ----------------------------/

// [선생님_마이페이지] T_mypage END ----------------------------/
//[TU-01] 마이페이지(교사) 진입 API
API.tutor.tmypage = function(options, cb) {
    let {data} = options || {};

    console.log("[TU-01] 마이페이지(교사) 진입 API",data);

    let org_id = data.org_id;
    let user_id = data.user_id;
    let user_type = data.user_type;

    apiAjaxGet({url: `${this._class}/mypage?org_id=${org_id}&user_id=${user_id}&user_type=${user_type}`}, cb);
}

//[TU-02] 사용자 이름 중복 확인 API
API.student.tckName = function(options, cb) {
    let {data} = options || {};

    console.log("[TU-02] 사용자 이름 중복 확인 API",data);

    apiAjaxPost({url: `${this._user}/check-name`}, data, cb);
}


//[ST-USER-02] 사용자(선생님) 비밀번호 변경 API
API.student.tSave = function(options, cb) {
    let {data} = options || {};

    console.log("[ST-USER-02] 사용자(선생님) 비밀번호 변경 API",data);

    apiAjaxPost({url: `${this._user}/change-pass`}, data,cb);
}

// [선생님_마이페이지] T_mypage END ----------------------------/

// [클래스 상세_선생님] T_detail START ----------------------------/
// [TU-CL-07] 교사 클래스 상세 페이지 진입
API.tutor.tdetail = function(options, cb) {
    let {data} = options || {};

    console.log("[TU-CL-07] 교사 클래스 상세 페이지 진입",data);

    let org_id = data.org_id;
    let mgr_id = data.user_id;
    let class_id = data.class_id;

    apiAjaxGet({url: `${this._class}/detail?org_id=${org_id}&mgr_id=${mgr_id}&class_id=${class_id}`}, cb);
}
// [클래스 상세_선생님] T_detail END ----------------------------/

// [학생 상세_선생님] T_sdetail START ----------------------------/
// [TU-SL-07] 교사 클래스 상세 페이지 진입
API.tutor.tsdetail = function(options, cb) {
    let {data} = options || {};

    console.log("[TU-SL-07] 교사 클래스 상세 페이지 진입",data);

    let org_id = data.org_id;
    let user_id = data.user_id;
    let user_grd = data.user_grd;

    apiAjaxGet({url: `${this._student}/detail?org_id=${org_id}&user_id=${user_id}&user_grd=${user_grd}`}, cb);
}

// [TU-SL-08] 학생 상세 상태 변경 저장
API.tutor.tsSave = function(options, cb) {
    let {data} = options || {};

    console.log("[TU-SL-08] 학생 상세 상태 변경 저장",data);

    apiAjaxPost({url: `${this._student}/detail-save`},data, cb);
}
// [학생 상세_선생님] T_sdetail END ----------------------------/


// [학생 상세_선생님] O_detail START ----------------------------/
API.admin.odetail = function(options, cb) {
    let {data} = options || {};

    console.log("[TU-CL-07] 교사 클래스 상세 페이지 진입",data);

    let org_id = data.org_id;
    let class_id = data.class_id;

    apiAjaxGet({url: `${this._class}-detail?org_id=${org_id}&class_id=${class_id}`}, cb);
}
// [학생 상세_선생님] O_detail END ----------------------------/


// [학생 상세_관리자(기관)] O_sdetail START ----------------------------/
// [AD-ST-07] 관리자(기관) 학생 상세 페이지 진입
API.admin.osdetail = function(options, cb) {
    let {data} = options || {};

    console.log("[AD-ST-07] 관리자(기관) 학생 상세 페이지 진입",data);

    let org_id = data.org_id;
    let user_id = data.user_id;
    let user_grd = data.user_grd;

    apiAjaxGet({url: `${this._student}-detail?org_id=${org_id}&user_id=${user_id}&user_grd=${user_grd}`}, cb);
}

// [TU-SL-08] 학생 상세 상태 변경 저장
API.tutor.tsSave = function(options, cb) {
    let {data} = options || {};

    console.log("[TU-SL-08] 학생 상세 상태 변경 저장",data);

    apiAjaxPost({url: `${this._student}/detail-save`},data, cb);
}

// [학생 상세_관리자(기관)] O_sdetail END ----------------------------/

// [관리자(기관)_마이페이지] S_admin START ----------------------------/
//[AD-01] 관리자(기관) 계정관리페이지 데이터 조회 API
API.admin.amypage = function(options, cb) {
    let {data} = options || {};

    console.log("[AD-01] 관리자(기관) 계정관리페이지 데이터 조회 API",data);

    let org_id = data.org_id;
    let user_id = data.user_id;

    apiAjaxGet({url: `${this._base}/admin-page?org_id=${org_id}&user_id=${user_id}`}, cb);
}


//[ST-USER-02] 사용자 비밀번호 변경 API
API.student.aSave = function(options, cb) {
    let {data} = options || {};

    console.log("[ST-USER-02] 사용자 비밀번호 변경 API",data);

    apiAjaxPost({url: `${this._user}/change-pass`}, data,cb);
}


//[AD-04] 선생님 비밀번호 리셋 API
API.admin.atSave = function(options, cb) {
    let {data} = options || {};

    console.log("[AD-04] 선생님 비밀번호 리셋 API",data);

    apiAjaxPost({url: `${this._base}/change-pass-list`}, data,cb);
}
// [관리자(기관)_마이페이지] S_admin END ----------------------------/

// [Aitutor] logout START ----------------------------/
//[LOG-03] 로그아웃 API
API.login.logout = function(options, cb) {
    let {data} = options || {};
    
    console.log("[LOG-03] 로그아웃 API",data);

    apiAjaxGetLogin({url: `/logout`},cb);
}
// [Aitutor] logout END ----------------------------/

API.image.viewer = function(filePath) {
    return `${this._base}?filePath=${filePath}`;
}