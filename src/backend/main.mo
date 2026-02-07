import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type PhoneNumber = Text;

  type UserRole = {
    #teacher;
    #parent;
  };

  public type UserProfile = {
    phoneNumber : PhoneNumber;
    role : UserRole;
    name : Text;
  };

  type Student = {
    id : Nat;
    name : Text;
    parentPhone : PhoneNumber;
    classId : Nat;
  };

  type Class = {
    id : Nat;
    name : Text;
    teacher : Principal;
  };

  type AttendanceRecord = {
    date : Int;
    presentStudents : [Nat];
  };

  var nextClassId : Nat = 1;
  var nextStudentId : Nat = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let classes = Map.empty<Nat, Class>();
  let students = Map.empty<Nat, Student>();
  let classAttendances = Map.empty<Nat, Map.Map<Int, AttendanceRecord>>();

  // Helper function to check if caller is a teacher
  func isTeacher(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role) {
          case (#teacher) { true };
          case (#parent) { false };
        };
      };
    };
  };

  // Helper function to check if caller is a parent
  func isParent(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role) {
          case (#parent) { true };
          case (#teacher) { false };
        };
      };
    };
  };

  // Helper function to check if teacher owns a class
  func ownsClass(caller : Principal, classId : Nat) : Bool {
    switch (classes.get(classId)) {
      case (null) { false };
      case (?class_) { class_.teacher == caller };
    };
  };

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Class management
  public shared ({ caller }) func createClass(name : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create classes");
    };

    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can create classes");
    };

    let classId = nextClassId;
    nextClassId += 1;
    let newClass = {
      id = classId;
      name;
      teacher = caller;
    };

    classes.add(classId, newClass);
    classId;
  };

  public shared ({ caller }) func addStudent(classId : Nat, name : Text, parentPhone : PhoneNumber) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add students");
    };

    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can add students");
    };

    if (not ownsClass(caller, classId)) {
      Runtime.trap("Unauthorized: You can only add students to your own classes");
    };

    switch (classes.get(classId)) {
      case (null) { Runtime.trap("Class not found") };
      case (?_) {
        let studentId = nextStudentId;
        nextStudentId += 1;
        let newStudent = {
          id = studentId;
          name;
          parentPhone;
          classId;
        };

        students.add(studentId, newStudent);
        studentId;
      };
    };
  };

  public shared ({ caller }) func takeAttendance(classId : Nat, date : Int, presentStudentIds : [Nat]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can take attendance");
    };

    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can take attendance");
    };

    if (not ownsClass(caller, classId)) {
      Runtime.trap("Unauthorized: You can only take attendance for your own classes");
    };

    switch (classes.get(classId)) {
      case (null) { Runtime.trap("Class not found") };
      case (?_) {
        let record : AttendanceRecord = { date; presentStudents = presentStudentIds };

        let classAttendanceMap = switch (classAttendances.get(classId)) {
          case (null) {
            let newMap = Map.empty<Int, AttendanceRecord>();
            classAttendances.add(classId, newMap);
            newMap;
          };
          case (?existingMap) { existingMap };
        };

        classAttendanceMap.add(date, record);
      };
    };
  };

  // Query functions
  public query ({ caller }) func getTeacherClasses() : async [Class] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access classes");
    };

    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can access their classes");
    };

    let result = classes.values().toArray().filter(
      func(c : Class) : Bool { c.teacher == caller }
    );
    result;
  };

  public query ({ caller }) func getMyStudents() : async [Student] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view students");
    };

    if (not isParent(caller)) {
      Runtime.trap("Unauthorized: Only parents can view their students");
    };

    // Get caller's phone number from profile
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let result = students.values().toArray().filter(
          func(s : Student) : Bool { s.parentPhone == profile.phoneNumber }
        );
        result;
      };
    };
  };

  public query ({ caller }) func getClassStudents(classId : Nat) : async [Student] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view students");
    };

    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can view class students");
    };

    if (not ownsClass(caller, classId)) {
      Runtime.trap("Unauthorized: You can only view students in your own classes");
    };

    let result = students.values().toArray().filter(
      func(s : Student) : Bool { s.classId == classId }
    );
    result;
  };

  public query ({ caller }) func getAttendance(classId : Nat, date : Int) : async ?AttendanceRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance");
    };

    // Teachers can view their own classes
    if (isTeacher(caller)) {
      if (not ownsClass(caller, classId)) {
        Runtime.trap("Unauthorized: You can only view attendance for your own classes");
      };
    } else if (isParent(caller)) {
      // Parents can view attendance for classes where their children are enrolled
      switch (userProfiles.get(caller)) {
        case (null) { Runtime.trap("User profile not found") };
        case (?profile) {
          let hasStudentInClass = students.values().toArray().find(
            func(s : Student) : Bool {
              s.parentPhone == profile.phoneNumber and s.classId == classId
            }
          );
          switch (hasStudentInClass) {
            case (null) { Runtime.trap("Unauthorized: You don't have students in this class") };
            case (?_) {};
          };
        };
      };
    } else {
      Runtime.trap("Unauthorized: Invalid user role");
    };

    switch (classAttendances.get(classId)) {
      case (null) { null };
      case (?attendanceMap) {
        attendanceMap.get(date);
      };
    };
  };

  public query ({ caller }) func getStudentAttendanceHistory(studentId : Nat) : async [AttendanceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance history");
    };

    // Get the student
    switch (students.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        // Check authorization
        if (isTeacher(caller)) {
          if (not ownsClass(caller, student.classId)) {
            Runtime.trap("Unauthorized: You can only view attendance for students in your classes");
          };
        } else if (isParent(caller)) {
          switch (userProfiles.get(caller)) {
            case (null) { Runtime.trap("User profile not found") };
            case (?profile) {
              if (student.parentPhone != profile.phoneNumber) {
                Runtime.trap("Unauthorized: You can only view attendance for your own children");
              };
            };
          };
        } else {
          Runtime.trap("Unauthorized: Invalid user role");
        };

        // Return attendance records for this student's class
        switch (classAttendances.get(student.classId)) {
          case (null) { [] };
          case (?attendanceMap) {
            attendanceMap.values().toArray();
          };
        };
      };
    };
  };
};
