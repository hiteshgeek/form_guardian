<?php
/**
 * FormGuardian Demo - Form Elements
 * All HTML5 input types with Bootstrap markup
 */

// Bootstrap version specific classes
$formGroup = $bootstrapVersion === 5 ? 'mb-3' : 'form-group';
$formLabel = $bootstrapVersion === 5 ? 'form-label' : 'control-label';
$formControl = 'form-control';
$formCheck = $bootstrapVersion === 3 ? 'checkbox' : 'form-check';
$formCheckInput = $bootstrapVersion === 3 ? '' : 'form-check-input';
$formCheckLabel = $bootstrapVersion === 3 ? '' : 'form-check-label';
$formRadio = $bootstrapVersion === 3 ? 'radio' : 'form-check';
$formSelect = $bootstrapVersion === 5 ? 'form-select' : 'form-control';
$formText = $bootstrapVersion === 5 ? 'form-text' : 'help-block';
$row = 'row';
$col = $bootstrapVersion === 3 ? 'col-sm-6' : 'col-md-6';
?>

<!-- Text Inputs Section -->
<fieldset class="fg-fieldset">
    <legend>Text Inputs</legend>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="text-basic" class="<?= $formLabel ?>">Basic Text</label>
                <input type="text" class="<?= $formControl ?>" id="text-basic" name="text_basic" placeholder="Enter text">
                <small class="<?= $formText ?>">A simple text input field</small>
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="text-username" class="<?= $formLabel ?>">Username</label>
                <input type="text" class="<?= $formControl ?>" id="text-username" name="username" placeholder="Choose a username">
            </div>
        </div>
    </div>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="email" class="<?= $formLabel ?>">Email Address</label>
                <input type="email" class="<?= $formControl ?>" id="email" name="email" placeholder="name@example.com">
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="email-confirm" class="<?= $formLabel ?>">Confirm Email</label>
                <input type="email" class="<?= $formControl ?>" id="email-confirm" name="email_confirm" placeholder="Confirm your email">
            </div>
        </div>
    </div>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="password" class="<?= $formLabel ?>">Password</label>
                <input type="password" class="<?= $formControl ?>" id="password" name="password" placeholder="Enter password">
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="password-confirm" class="<?= $formLabel ?>">Confirm Password</label>
                <input type="password" class="<?= $formControl ?>" id="password-confirm" name="password_confirm" placeholder="Confirm password">
            </div>
        </div>
    </div>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="url" class="<?= $formLabel ?>">Website URL</label>
                <input type="url" class="<?= $formControl ?>" id="url" name="url" placeholder="https://example.com">
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="phone" class="<?= $formLabel ?>">Phone Number</label>
                <input type="tel" class="<?= $formControl ?>" id="phone" name="phone" placeholder="+1 (555) 123-4567">
            </div>
        </div>
    </div>

    <div class="<?= $formGroup ?>">
        <label for="search" class="<?= $formLabel ?>">Search</label>
        <input type="search" class="<?= $formControl ?>" id="search" name="search" placeholder="Search...">
    </div>
</fieldset>

<!-- Number Inputs Section -->
<fieldset class="fg-fieldset">
    <legend>Number Inputs</legend>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="number-basic" class="<?= $formLabel ?>">Basic Number</label>
                <input type="number" class="<?= $formControl ?>" id="number-basic" name="number_basic" placeholder="Enter a number">
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="number-age" class="<?= $formLabel ?>">Age</label>
                <input type="number" class="<?= $formControl ?>" id="number-age" name="age" min="0" max="150" placeholder="Your age">
            </div>
        </div>
    </div>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="number-price" class="<?= $formLabel ?>">Price ($)</label>
                <input type="number" class="<?= $formControl ?>" id="number-price" name="price" step="0.01" min="0" placeholder="0.00">
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="number-quantity" class="<?= $formLabel ?>">Quantity</label>
                <input type="number" class="<?= $formControl ?>" id="number-quantity" name="quantity" min="1" step="1" placeholder="1">
            </div>
        </div>
    </div>

    <div class="<?= $formGroup ?>">
        <label for="range" class="<?= $formLabel ?>">Range (0-100): <span id="range-value">50</span></label>
        <input type="range" class="<?= $bootstrapVersion === 5 ? 'form-range' : 'form-control-range' ?>" id="range" name="range" min="0" max="100" value="50">
    </div>
</fieldset>

<!-- Date & Time Inputs Section -->
<fieldset class="fg-fieldset">
    <legend>Date & Time Inputs</legend>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="date" class="<?= $formLabel ?>">Date</label>
                <input type="date" class="<?= $formControl ?>" id="date" name="date">
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="time" class="<?= $formLabel ?>">Time</label>
                <input type="time" class="<?= $formControl ?>" id="time" name="time">
            </div>
        </div>
    </div>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="datetime" class="<?= $formLabel ?>">Date & Time</label>
                <input type="datetime-local" class="<?= $formControl ?>" id="datetime" name="datetime">
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="month" class="<?= $formLabel ?>">Month</label>
                <input type="month" class="<?= $formControl ?>" id="month" name="month">
            </div>
        </div>
    </div>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="week" class="<?= $formLabel ?>">Week</label>
                <input type="week" class="<?= $formControl ?>" id="week" name="week">
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="birthdate" class="<?= $formLabel ?>">Birth Date</label>
                <input type="date" class="<?= $formControl ?>" id="birthdate" name="birthdate">
                <small class="<?= $formText ?>">Must be at least 18 years old</small>
            </div>
        </div>
    </div>
</fieldset>

<!-- Selection Inputs Section -->
<fieldset class="fg-fieldset">
    <legend>Selection Inputs</legend>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="select-single" class="<?= $formLabel ?>">Single Select</label>
                <select class="<?= $formSelect ?>" id="select-single" name="select_single">
                    <option value="">-- Select an option --</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                    <option value="option4">Option 4</option>
                </select>
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="select-country" class="<?= $formLabel ?>">Country</label>
                <select class="<?= $formSelect ?>" id="select-country" name="country">
                    <option value="">-- Select country --</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                    <option value="jp">Japan</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>
    </div>

    <div class="<?= $formGroup ?>">
        <label for="select-multiple" class="<?= $formLabel ?>">Multiple Select (hold Ctrl/Cmd to select multiple)</label>
        <select class="<?= $formSelect ?>" id="select-multiple" name="select_multiple[]" multiple size="4">
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="php">PHP</option>
            <option value="python">Python</option>
            <option value="ruby">Ruby</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
        </select>
    </div>
</fieldset>

<!-- Checkboxes & Radios Section -->
<fieldset class="fg-fieldset">
    <legend>Checkboxes & Radio Buttons</legend>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label class="<?= $formLabel ?>">Checkbox Group - Interests</label>
                <?php
                $interests = ['sports' => 'Sports', 'music' => 'Music', 'movies' => 'Movies', 'gaming' => 'Gaming', 'reading' => 'Reading'];
                foreach ($interests as $value => $label):
                ?>
                <div class="<?= $formCheck ?>">
                    <?php if ($bootstrapVersion === 3): ?>
                    <label>
                        <input type="checkbox" name="interests[]" value="<?= $value ?>"> <?= $label ?>
                    </label>
                    <?php else: ?>
                    <input class="<?= $formCheckInput ?>" type="checkbox" name="interests[]" value="<?= $value ?>" id="interest-<?= $value ?>">
                    <label class="<?= $formCheckLabel ?>" for="interest-<?= $value ?>"><?= $label ?></label>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label class="<?= $formLabel ?>">Radio Group - Gender</label>
                <?php
                $genders = ['male' => 'Male', 'female' => 'Female', 'other' => 'Other', 'prefer_not' => 'Prefer not to say'];
                foreach ($genders as $value => $label):
                ?>
                <div class="<?= $formRadio ?>">
                    <?php if ($bootstrapVersion === 3): ?>
                    <label>
                        <input type="radio" name="gender" value="<?= $value ?>"> <?= $label ?>
                    </label>
                    <?php else: ?>
                    <input class="<?= $formCheckInput ?>" type="radio" name="gender" value="<?= $value ?>" id="gender-<?= $value ?>">
                    <label class="<?= $formCheckLabel ?>" for="gender-<?= $value ?>"><?= $label ?></label>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <div class="<?= $formGroup ?>">
        <div class="<?= $formCheck ?>">
            <?php if ($bootstrapVersion === 3): ?>
            <label>
                <input type="checkbox" name="terms" id="terms" value="accepted"> I agree to the <a href="#">Terms and Conditions</a>
            </label>
            <?php else: ?>
            <input class="<?= $formCheckInput ?>" type="checkbox" name="terms" id="terms" value="accepted">
            <label class="<?= $formCheckLabel ?>" for="terms">I agree to the <a href="#">Terms and Conditions</a></label>
            <?php endif; ?>
        </div>
    </div>

    <div class="<?= $formGroup ?>">
        <div class="<?= $formCheck ?>">
            <?php if ($bootstrapVersion === 3): ?>
            <label>
                <input type="checkbox" name="newsletter" id="newsletter" value="yes"> Subscribe to newsletter
            </label>
            <?php else: ?>
            <input class="<?= $formCheckInput ?>" type="checkbox" name="newsletter" id="newsletter" value="yes">
            <label class="<?= $formCheckLabel ?>" for="newsletter">Subscribe to newsletter</label>
            <?php endif; ?>
        </div>
    </div>
</fieldset>

<!-- Textarea Section -->
<fieldset class="fg-fieldset">
    <legend>Text Areas</legend>

    <div class="<?= $formGroup ?>">
        <label for="textarea-bio" class="<?= $formLabel ?>">Bio / About</label>
        <textarea class="<?= $formControl ?>" id="textarea-bio" name="bio" rows="3" placeholder="Tell us about yourself..."></textarea>
        <small class="<?= $formText ?>">Maximum 500 characters</small>
    </div>

    <div class="<?= $formGroup ?>">
        <label for="textarea-message" class="<?= $formLabel ?>">Message</label>
        <textarea class="<?= $formControl ?>" id="textarea-message" name="message" rows="5" placeholder="Your message..."></textarea>
    </div>
</fieldset>

<!-- File Inputs Section -->
<fieldset class="fg-fieldset">
    <legend>File Inputs</legend>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="file-single" class="<?= $formLabel ?>">Single File</label>
                <?php if ($bootstrapVersion === 3): ?>
                <input type="file" id="file-single" name="file_single">
                <?php else: ?>
                <input type="file" class="<?= $formControl ?>" id="file-single" name="file_single">
                <?php endif; ?>
                <small class="<?= $formText ?>">Max 5MB</small>
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="file-multiple" class="<?= $formLabel ?>">Multiple Files</label>
                <?php if ($bootstrapVersion === 3): ?>
                <input type="file" id="file-multiple" name="file_multiple[]" multiple>
                <?php else: ?>
                <input type="file" class="<?= $formControl ?>" id="file-multiple" name="file_multiple[]" multiple>
                <?php endif; ?>
                <small class="<?= $formText ?>">Select up to 5 files</small>
            </div>
        </div>
    </div>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="file-image" class="<?= $formLabel ?>">Image Upload</label>
                <?php if ($bootstrapVersion === 3): ?>
                <input type="file" id="file-image" name="file_image" accept="image/*">
                <?php else: ?>
                <input type="file" class="<?= $formControl ?>" id="file-image" name="file_image" accept="image/*">
                <?php endif; ?>
                <small class="<?= $formText ?>">Images only (JPG, PNG, GIF)</small>
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="file-document" class="<?= $formLabel ?>">Document Upload</label>
                <?php if ($bootstrapVersion === 3): ?>
                <input type="file" id="file-document" name="file_document" accept=".pdf,.doc,.docx">
                <?php else: ?>
                <input type="file" class="<?= $formControl ?>" id="file-document" name="file_document" accept=".pdf,.doc,.docx">
                <?php endif; ?>
                <small class="<?= $formText ?>">PDF or Word documents</small>
            </div>
        </div>
    </div>
</fieldset>

<!-- Other Inputs Section -->
<fieldset class="fg-fieldset">
    <legend>Other Inputs</legend>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="color" class="<?= $formLabel ?>">Favorite Color</label>
                <input type="color" class="<?= $formControl ?> <?= $bootstrapVersion === 5 ? 'form-control-color' : '' ?>" id="color" name="color" value="#0d6efd">
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="credit-card" class="<?= $formLabel ?>">Credit Card Number</label>
                <input type="text" class="<?= $formControl ?>" id="credit-card" name="credit_card" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
        </div>
    </div>

    <div class="<?= $row ?>">
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="postal-code" class="<?= $formLabel ?>">Postal Code</label>
                <input type="text" class="<?= $formControl ?>" id="postal-code" name="postal_code" placeholder="12345 or A1B 2C3">
            </div>
        </div>
        <div class="<?= $col ?>">
            <div class="<?= $formGroup ?>">
                <label for="ip-address" class="<?= $formLabel ?>">IP Address</label>
                <input type="text" class="<?= $formControl ?>" id="ip-address" name="ip_address" placeholder="192.168.1.1">
            </div>
        </div>
    </div>

    <!-- Hidden field for testing -->
    <input type="hidden" id="hidden-field" name="hidden_field" value="hidden_value">
</fieldset>

<script>
// Range input value display
document.getElementById('range')?.addEventListener('input', function() {
    document.getElementById('range-value').textContent = this.value;
});
</script>
