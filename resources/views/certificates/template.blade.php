<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificate of Completion</title>
    <style>
        @page {
            margin: 0;
            size: A4 landscape;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            width: 297mm;
            height: 210mm;
            position: relative;
            overflow: hidden;
        }
        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .border-frame {
            position: absolute;
            top: 15mm;
            left: 15mm;
            right: 15mm;
            bottom: 15mm;
            border: 3px solid rgba(255, 255, 255, 0.3);
        }
        .inner-border {
            position: absolute;
            top: 18mm;
            left: 18mm;
            right: 18mm;
            bottom: 18mm;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .content {
            position: absolute;
            top: 25mm;
            left: 25mm;
            right: 25mm;
            bottom: 25mm;
            background: white;
            padding: 30px 40px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .header {
            padding-bottom: 15px;
            border-bottom: 2px solid #667eea;
        }
        .title {
            font-size: 42px;
            color: #667eea;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 8px;
        }
        .subtitle {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .body {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 20px 0;
        }
        .presented-to {
            font-size: 13px;
            color: #666;
            margin-bottom: 12px;
        }
        .recipient-name {
            font-size: 38px;
            color: #333;
            font-weight: bold;
            margin-bottom: 20px;
            padding-bottom: 8px;
            border-bottom: 2px solid #667eea;
            display: inline-block;
        }
        .achievement-text {
            font-size: 13px;
            color: #666;
            margin-bottom: 15px;
        }
        .course-name {
            font-size: 26px;
            color: #764ba2;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .score-badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 25px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
        }
        .footer {
            padding-top: 15px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .date-section {
            text-align: left;
        }
        .date-label {
            font-size: 10px;
            color: #999;
            text-transform: uppercase;
        }
        .date-value {
            font-size: 12px;
            color: #333;
            font-weight: bold;
        }
        .signature-section {
            text-align: right;
        }
        .signature-line {
            width: 150px;
            border-top: 2px solid #333;
            margin-bottom: 5px;
        }
        .signature-label {
            font-size: 10px;
            color: #666;
        }
        .decorative-element {
            position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
        }
        .element-1 { top: 20mm; left: 20mm; }
        .element-2 { top: 20mm; right: 20mm; }
        .element-3 { bottom: 20mm; left: 20mm; }
        .element-4 { bottom: 20mm; right: 20mm; }
    </style>
</head>
<body>
    <div class="background">
        <div class="decorative-element element-1"></div>
        <div class="decorative-element element-2"></div>
        <div class="decorative-element element-3"></div>
        <div class="decorative-element element-4"></div>
    </div>
    <div class="border-frame"></div>
    <div class="inner-border"></div>
    
    <div class="content">
        <div class="header">
            <div class="title">CERTIFICATE</div>
            <div class="subtitle">Of Completion</div>
        </div>
        
        <div class="body">
            <div class="presented-to">This certificate is proudly presented to</div>
            <div class="recipient-name">{{ $user->name }}</div>
            <div class="achievement-text">for successfully completing the course</div>
            <div class="course-name">{{ $course->title }}</div>
            <div class="score-badge">Final Score: {{ round($score) }}%</div>
        </div>
        
        <div class="footer">
            <div class="date-section">
                <div class="date-label">Date of Issue</div>
                <div class="date-value">{{ $date }}</div>
            </div>
            <div class="signature-section">
                <div class="signature-line"></div>
                <div class="signature-label">Authorized Signature</div>
            </div>
        </div>
    </div>
</body>
</html>
