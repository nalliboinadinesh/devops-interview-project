# 📝 TEST DATA - READY TO USE

Copy and paste this data directly into the form fields for quick testing.

---

## Test Student #1: Minimal Data (Quick Test)

**Personal Info Tab**:
```
PIN: TEST001
First Name: John
Last Name: Doe
Date of Birth: 2000-01-15
Gender: Male
Email: john.doe@test.com
Phone: 9876543210
Address: 123 Main St
City: Bangalore
State: Karnataka
Postal Code: 560001
```

**Skip other tabs** (leave empty)

**Expected Result**: ✅ Student created successfully

---

## Test Student #2: Full Data (Complete Test)

**Personal Info Tab**:
```
PIN: TEST002
First Name: Sarah
Last Name: Khan
Date of Birth: 2000-05-20
Gender: Female
Email: sarah.khan@test.com
Phone: 9123456789
Address: 456 Oak Avenue
City: Hyderabad
State: Telangana
Postal Code: 500001
```

**Academic Info Tab**:
```
Regulation: R19
Current Semester: 5
CGPA: 8.75
```

**Attendance Tab**:
```
Overall Attendance: 88
Click "Add Semester 1":
  Classes Attended: 45
  Total Classes: 50
Click "Add Semester 2":
  Classes Attended: 47
  Total Classes: 50
```

**Fee Status Tab** (Optional):
```
Total Paid: 50000
Total Due: 25000
```

**Expected Result**: ✅ Student created with all details

---

## Test Student #3: Different Branch (Test Validation)

**Personal Info Tab**:
```
PIN: TEST003
First Name: Rajesh
Last Name: Kumar
Date of Birth: 2000-08-10
Gender: Male
Email: rajesh@test.com
Phone: 9234567890
Address: 789 Pine Road
City: Pune
State: Maharashtra
Postal Code: 411001
```

**Branch Selection**: ECE (instead of CSE)

**Academic Info Tab**:
```
Regulation: R20
Current Semester: 3
CGPA: 7.5
```

**Expected Result**: ✅ Student created with ECE branch

---

## Test Student #4: High CGPA (Edge Case)

**Personal Info Tab**:
```
PIN: TEST004
First Name: Priya
Last Name: Singh
Date of Birth: 1999-12-05
Gender: Female
Email: priya.singh@test.com
Phone: 9345678901
Address: 321 Elm Street
City: Delhi
State: Delhi
Postal Code: 110001
```

**Academic Info Tab**:
```
Regulation: R19
Current Semester: 7
CGPA: 10.0 (Maximum allowed)
```

**Expected Result**: ✅ Student created with perfect CGPA

---

## Test Student #5: Low Attendance (Edge Case)

**Personal Info Tab**:
```
PIN: TEST005
First Name: Vikram
Last Name: Patel
Date of Birth: 2001-03-15
Gender: Male
Email: vikram.patel@test.com
Phone: 9456789012
Address: 654 Maple Lane
City: Ahmedabad
State: Gujarat
Postal Code: 380001
```

**Attendance Tab**:
```
Overall Attendance: 45 (Low attendance)
Click "Add Semester 1":
  Classes Attended: 18
  Total Classes: 40
Click "Add Semester 2":
  Classes Attended: 20
  Total Classes: 40
```

**Expected Result**: ✅ Student created with low attendance

---

## 🧪 VALIDATION TESTS (Test Form Error Handling)

### Test: Missing PIN
1. Leave PIN empty
2. Fill other required fields
3. Click Save
4. **Expected**: Error toast "Please fill all required fields"

### Test: Missing Gender
1. Fill all fields except Gender
2. Click Save
3. **Expected**: Error toast "Please fill all required fields"

### Test: Invalid Email
1. Email: `invalid-email` (no @)
2. Fill other fields correctly
3. Click Save
4. **Expected**: Error toast "Please enter a valid email"

### Test: Invalid Phone
1. Phone: `12345` (less than 10 digits)
2. Fill other fields correctly
3. Click Save
4. **Expected**: Error toast "Phone number must be 10 digits"

### Test: CGPA Too High
1. CGPA: `11` (more than 10)
2. Fill other fields correctly
3. Click Save
4. **Expected**: Error toast "CGPA must be between 0 and 10"

### Test: Wrong Branch Enum
**This should NOT happen if using dropdown**, but if manually entered:
1. Branch: `Computer` (not in enum)
2. Fill other fields correctly
3. Click Save
4. **Expected**: Server error "Branch is not a valid enum value"
   - **Note**: Always use dropdown to avoid this

---

## ✅ VERIFICATION CHECKLIST FOR EACH TEST

After submitting each student, verify:

- [ ] Success toast appears: "Student created successfully"
- [ ] Modal closes automatically
- [ ] Student list refreshes
- [ ] New student appears in the Admin app list
- [ ] Can find student in User app by searching PIN
- [ ] All data fields preserved correctly
- [ ] Data matches exactly what was entered

---

## 📊 Expected Branch Values

When filling the form, use EXACT values from this list:
- `CSE` - Computer Science
- `ECE` - Electronics
- `Civil` - Civil Engineering
- `Mech` - Mechanical Engineering
- `EEE` - Electrical Engineering
- `AIML` - AI & Machine Learning
- `CCN` - Cloud Computing & Networks

**Use the dropdown** to avoid manual entry errors.

---

## 👥 Gender Options

When filling the form, select from:
- `Male`
- `Female`
- `Other`

**Use the dropdown** to avoid errors.

---

## 🔢 CGPA Range

Valid range: **0 to 10** (inclusive)
- Minimum: `0.0`
- Maximum: `10.0`
- Examples: 7.5, 8.25, 9.0, 10.0

---

## 📱 Phone Number Format

Must be exactly **10 digits**:
- Valid: `9876543210`
- Invalid: `987654321` (9 digits)
- Invalid: `98765432101` (11 digits)
- Invalid: `+91 9876543210` (has special characters)

---

## 📧 Email Format

Must be valid email:
- Valid: `john@example.com`
- Valid: `john.doe@test.co.uk`
- Invalid: `john@domain` (missing extension)
- Invalid: `john domain@com` (space)
- Invalid: `@example.com` (missing name)

---

## 🎓 Semester Range

Valid semester values: **1 to 8**
- Minimum: `1`
- Maximum: `8`

---

## 📅 Date Format

Date format: **YYYY-MM-DD**
- Example: `2000-01-15` (January 15, 2000)
- Use the date picker UI (click on date field)

---

## 💡 Pro Tips for Testing

1. **Use unique PINs**: Each PIN must be unique. If you get error "PIN already exists", use a different PIN.
   
2. **Test incrementally**: Start with Test Student #1 (minimal), then try complete data.

3. **Check console**: Open F12 console before submitting to see logged data.

4. **Refresh browser**: After adding students, refresh (Ctrl+R) to see updated list.

5. **Test in both apps**: Add student in Admin app, then verify in User app.

6. **Clear data**: If you want to start over, delete test students or use different PINs.

---

## 🐛 Troubleshooting

**Q: Form won't submit**
- A: Check browser console (F12) for error messages
- A: Ensure all required fields are filled (9 validation checks)

**Q: See "PIN already exists" error**
- A: Change the PIN to something unique (TEST999, etc.)

**Q: Student doesn't appear in list**
- A: Click "Refresh" or reload page (Ctrl+R)
- A: Check filters (branch, academic year)

**Q: Data doesn't appear in User app**
- A: Wait a moment for sync to complete
- A: Refresh User app page (Ctrl+R)
- A: Verify backend is running (http://localhost:5000)

**Q: See error "Branch is not valid"**
- A: Use the branch dropdown, don't type manually
- A: Ensure exactly matching enum: CSE, ECE, Civil, Mech, EEE, AIML, CCN

---

**Ready to test! 🚀**

Pick Test Student #1 for quickest validation, or Test Student #2 for complete testing.

